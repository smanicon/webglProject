import { mat4 } from 'gl-matrix'
import vertexShaderSource from './shader/vertex.vert'
import fragmentShaderSource from './shader/fragment.frag'
import { MeshDisplay } from './graphic/core/MeshDisplay'
import { TriangularPrismMeshVertices } from './model/TriangularPrismMeshVertices'
import { Mesh } from './graphic/api/Mesh'

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

  const mesh = new Mesh(new TriangularPrismMeshVertices())
  const meshDisplay = new MeshDisplay(mesh, gl)

  mesh.setPosition(0.0, 0.0, -3.0)

  const pMatrix = mat4.create()
  mat4.perspective(pMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 100.0)
  const pMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(glProgram, 'uPMatrix') as WebGLUniformLocation
  gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix)

  displayScene(gl, glProgram, 0, meshDisplay)
}

function displayScene (gl: WebGLRenderingContext, glProgram: WebGLProgram, frame: number, meshDisplay: MeshDisplay): void {
  gl.clearColor(0.1, 0.5, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  meshDisplay.mesh.xRotation = frame / 100
  meshDisplay.mesh.yRotation = frame / 100

  meshDisplay.display(glProgram)

  requestAnimationFrame(() => displayScene(gl, glProgram, frame + 1, meshDisplay))
}

function loadShader (gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
  const shader: WebGLShader = gl.createShader(shaderType) as WebGLShader
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  return shader
}

document.body.onload = main
