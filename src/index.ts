import { mat4 } from 'gl-matrix'
import vertexShaderSource from './shader/vertex.vert'
import fragmentShaderSource from './shader/fragment.frag'
import { MeshDisplay } from './model/MeshDisplay'
import { TriangularPrismMeshVertices } from './model/TriangularPrismMeshVertices'

function main (): void {
  const canvas: HTMLCanvasElement = document.querySelector('#gl_canvas') as HTMLCanvasElement
  const gl: WebGLRenderingContext = canvas.getContext('webgl') as WebGLRenderingContext

  gl.clearColor(0.1, 0.5, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, canvas.width, canvas.height)

  const glProgram: WebGLProgram = gl.createProgram() as WebGLProgram
  gl.attachShader(glProgram, loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER))
  gl.attachShader(glProgram, loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER))

  gl.linkProgram(glProgram)
  gl.useProgram(glProgram)

  const meshDisplay = new MeshDisplay(new TriangularPrismMeshVertices(), gl)

  const pMatrix = mat4.create()
  mat4.perspective(pMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100.0)
  const pMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(glProgram, 'uPMatrix') as WebGLUniformLocation
  gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix)

  displayScene(gl, glProgram, 0, meshDisplay)
}

function displayScene (gl: WebGLRenderingContext, glProgram: WebGLProgram, frame: number, meshDisplay: MeshDisplay): void {
  gl.clearColor(0.1, 0.5, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  initScenePosition(gl, glProgram, [0.0, 0.0, -3.0], frame / 100)

  meshDisplay.display(glProgram)

  requestAnimationFrame(() => displayScene(gl, glProgram, frame + 1, meshDisplay))
}

function initScenePosition (gl: WebGLRenderingContext, glProgram: WebGLProgram, position: number[], rotation: number): void {
  const mvMatrix = mat4.identity(mat4.create())
  mat4.translate(mvMatrix, mvMatrix, new Float32Array(position))
  mat4.rotateY(mvMatrix, mvMatrix, rotation)
  mat4.rotateX(mvMatrix, mvMatrix, rotation)

  const mvMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(glProgram, 'uMVMatrix') as WebGLUniformLocation
  gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix)
}

function loadShader (gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
  const shader: WebGLShader = gl.createShader(shaderType) as WebGLShader
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  return shader
}

document.body.onload = main
