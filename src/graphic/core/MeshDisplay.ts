import textureSrc from '../../images/opengl.svg'
import { MeshVertices } from '../api/MeshVertices'

export class MeshDisplay {
  private readonly gl: WebGLRenderingContext
  private readonly trianglesVerticesBuffer: WebGLBuffer
  private readonly trianglesColorBuffer: WebGLBuffer
  private readonly trianglesIndicesBuffer: WebGLBuffer
  private readonly trianglesTexCoordBuffer: WebGLBuffer

  public constructor (mesh: MeshVertices, gl: WebGLRenderingContext) {
    this.gl = gl
    this.loadTextureImage()
    this.trianglesVerticesBuffer = this.loadFloatArrayBuffer(mesh.vertices())
    this.trianglesColorBuffer = this.loadFloatArrayBuffer(mesh.colorVertices())
    this.trianglesTexCoordBuffer = this.loadFloatArrayBuffer(mesh.UVTextureVertices())
    this.trianglesIndicesBuffer = this.loadIndicesBuffer(mesh.indiceVertices())
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
