import { triangleVertices, triangleVerticesColors, triangleVertexIndices } from './TriangularPrismVertex'

export class TriangularPrismDisplay {
  private readonly gl: WebGLRenderingContext
  private readonly trianglesVerticesBuffer: WebGLBuffer
  private readonly trianglesColorBuffer: WebGLBuffer
  private readonly trianglesIndicesBuffer: WebGLBuffer

  public constructor (gl: WebGLRenderingContext) {
    this.gl = gl
    this.trianglesVerticesBuffer = this.loadTrianglesVerticesBuffer()
    this.trianglesColorBuffer = this.loadTrianglesColorBuffer()
    this.trianglesIndicesBuffer = this.loadTrianglesIndicesBuffer()
  }

  private loadTrianglesVerticesBuffer (): WebGLBuffer {
    const trianglesVerticesBuffer: WebGLBuffer = this.gl.createBuffer() as WebGLBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglesVerticesBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW)
    return trianglesVerticesBuffer
  }

  private loadTrianglesColorBuffer (): WebGLBuffer {
    const trianglesColorBuffer: WebGLBuffer = this.gl.createBuffer() as WebGLBuffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglesColorBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVerticesColors), this.gl.STATIC_DRAW)
    return trianglesColorBuffer
  }

  private loadTrianglesIndicesBuffer (): WebGLBuffer {
    const trianglesIndicesBuffer: WebGLBuffer = this.gl.createBuffer() as WebGLBuffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, trianglesIndicesBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVertexIndices), this.gl.STATIC_DRAW)
    return trianglesIndicesBuffer
  }

  public display (glProgram: WebGLProgram): void {
    const vertexAttribute = this.gl.getAttribLocation(glProgram, 'aVertexPosition')
    this.gl.enableVertexAttribArray(vertexAttribute)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesVerticesBuffer)
    this.gl.vertexAttribPointer(vertexAttribute, 3, this.gl.FLOAT, false, 0, 0)

    const vertexAttributeColor = this.gl.getAttribLocation(glProgram, 'aVertexColor')
    this.gl.enableVertexAttribArray(vertexAttributeColor)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.trianglesColorBuffer)
    this.gl.vertexAttribPointer(vertexAttributeColor, 3, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndicesBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, 10, this.gl.UNSIGNED_SHORT, 0)
  }
}
