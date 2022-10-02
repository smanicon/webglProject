import { triangleVertices, triangleVerticesColors, triangleVertexIndices } from './TriangularPrismVertex'

export class TriangularPrismDisplay {
  private readonly gl: WebGLRenderingContext
  private readonly trianglesVerticesBuffer: WebGLBuffer
  private readonly trianglesColorBuffer: WebGLBuffer
  private readonly trianglesIndicesBuffer: WebGLBuffer

  public constructor (gl: WebGLRenderingContext) {
    this.gl = gl
    this.trianglesVerticesBuffer = this.loadFloatArrayBuffer(triangleVertices)
    this.trianglesColorBuffer = this.loadFloatArrayBuffer(triangleVerticesColors)
    this.trianglesIndicesBuffer = this.loadIndicesBuffer(triangleVertexIndices)
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
