import { Camera } from '../api/Camera'
import { mat4 } from 'gl-matrix'

export class CameraDisplay {
  private readonly _camera: Camera
  private readonly _aspect: number
  private readonly _gl: WebGLRenderingContext

  public constructor (camera: Camera, aspect: number, gl: WebGLRenderingContext) {
    this._camera = camera
    this._aspect = aspect
    this._gl = gl
  }

  public display (glProgram: WebGLProgram): void {
    const pMatrix = mat4.create()
    mat4.perspective(pMatrix, this._camera.fovy, this._aspect, 0.1, 100.0)

    mat4.translate(pMatrix, pMatrix, new Float32Array([this._camera.xPosition, this._camera.yPosition, this._camera.zPosition]))
    mat4.rotateX(pMatrix, pMatrix, this._camera.xRotation)
    mat4.rotateY(pMatrix, pMatrix, this._camera.yRotation)
    mat4.rotateZ(pMatrix, pMatrix, this._camera.zRotation)

    const pMatrixUniform: WebGLUniformLocation = this._gl.getUniformLocation(glProgram, 'uPMatrix') as WebGLUniformLocation
    this._gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix)
  }
}
