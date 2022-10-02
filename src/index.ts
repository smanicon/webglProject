import { mat4 } from 'gl-matrix'
import vertexShaderSource from './shader/vertex.vert'
import fragmentShaderSource from './shader/fragment.frag'
import { TriangularPrismDisplay } from './model/TriangularPrismDisplay'

function main (): void {
  const canvas: HTMLCanvasElement = document.querySelector('#gl_canvas') as HTMLCanvasElement
  const gl: WebGLRenderingContext = canvas.getContext('webgl') as WebGLRenderingContext

  gl.clearColor(0.1, 0.5, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, canvas.width, canvas.height)

  const glProgram: WebGLProgram = gl.createProgram() as WebGLProgram
  gl.attachShader(glProgram, loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER))
  gl.attachShader(glProgram, loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER))

  gl.linkProgram(glProgram)
  gl.useProgram(glProgram)

  const triangularPrismDisplay = new TriangularPrismDisplay(gl)

  const pMatrix = mat4.create()
  mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0)
  const pMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(glProgram, 'uPMatrix') as WebGLUniformLocation
  gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix)

  const mvMatrix = mat4.create()
  mat4.identity(mvMatrix)
  mat4.translate(mvMatrix, mvMatrix, [-1.0, -1.0, -7.0])
  const mvMatrixUniform: WebGLUniformLocation = gl.getUniformLocation(glProgram, 'uMVMatrix') as WebGLUniformLocation
  gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix)

  triangularPrismDisplay.display(glProgram)
}

function loadShader (gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
  const shader: WebGLShader = gl.createShader(shaderType) as WebGLShader
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  return shader
}

document.body.onload = main
