import textureSrc from '../../images/opengl.svg'
import { Mesh } from '../api/Mesh'
import { mat4 } from 'gl-matrix'

export class MeshDisplay {
  private readonly gl: WebGLRenderingContext
  private readonly trianglesVerticesBuffer: WebGLBuffer
  private readonly trianglesColorBuffer: WebGLBuffer
  private readonly trianglesIndicesBuffer: WebGLBuffer
  private readonly trianglesTexCoordBuffer: WebGLBuffer
  public readonly mesh: Mesh

  public constructor (mesh: Mesh, gl: WebGLRenderingContext) {
    this.gl = gl
    this.mesh = mesh
    this.loadTextureImage()
    this.trianglesVerticesBuffer = this.loadFloatArrayBuffer(mesh.getMeshVertices().vertices())
    this.trianglesColorBuffer = this.loadFloatArrayBuffer(mesh.getMeshVertices().colorVertices())
    this.trianglesTexCoordBuffer = this.loadFloatArrayBuffer(mesh.getMeshVertices().UVTextureVertices())
    this.trianglesIndicesBuffer = this.loadIndicesBuffer(mesh.getMeshVertices().indiceVertices())
  }

  private loadFloatArrayBuffer (vertices: number[]): WebGLBuffer {
    const buffer: WebGLBuffer = this.gl.createBuffer() as WebGLBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
    return buffer
  }

  private loadIndicesBuffer (indices: number[]): WebGLBuffer {
    const buffer: WebGLBuffer = this.gl.createBuffer() as WebGLBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)
    return buffer
  }

  private loadTextureImage (): void {
    const gl: WebGLRenderingContext = this.gl
    const image: HTMLImageElement = new Image()

    image.onload = function () {
      const texture: WebGLTexture = gl.createTexture() as WebGLTexture
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      if (!gl.isTexture(texture)) {
        console.log('Error: Texture is invalid')
      }
    }
    image.src = textureSrc
  }

  public display (glProgram: WebGLProgram): void {
    const mvMatrix = mat4.identity(mat4.create())
    mat4.translate(mvMatrix, mvMatrix, new Float32Array([this.mesh.xPosition, this.mesh.yPosition, this.mesh.zPosition]))
    mat4.rotateX(mvMatrix, mvMatrix, this.mesh.xRotation)
    mat4.rotateY(mvMatrix, mvMatrix, this.mesh.yRotation)
    mat4.rotateZ(mvMatrix, mvMatrix, this.mesh.zRotation)

    const mvMatrixUniform: WebGLUniformLocation = this.gl.getUniformLocation(glProgram, 'uMVMatrix') as WebGLUniformLocation
    this.gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix)

    const textureUniform = this.gl.getUniformLocation(glProgram, 'uSampler')
    this.gl.uniform1i(textureUniform, 0)

    const vertexTexCoordAttribute = this.gl.getAttribLocation(glProgram, 'aVertexTextureCoord')
    this.gl.enableVertexAttribArray(vertexTexCoordAttribute)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesTexCoordBuffer)
    this.gl.vertexAttribPointer(vertexTexCoordAttribute, 2, this.gl.FLOAT, false, 0, 0)

    const vertexAttribute = this.gl.getAttribLocation(glProgram, 'aVertexPosition')
    this.gl.enableVertexAttribArray(vertexAttribute)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesVerticesBuffer)
    this.gl.vertexAttribPointer(vertexAttribute, 3, this.gl.FLOAT, false, 0, 0)

    const vertexAttributeColor = this.gl.getAttribLocation(glProgram, 'aVertexColor')
    this.gl.enableVertexAttribArray(vertexAttributeColor)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesColorBuffer)
    this.gl.vertexAttribPointer(vertexAttributeColor, 3, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndicesBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, 54, this.gl.UNSIGNED_SHORT, 0)
  }
}
