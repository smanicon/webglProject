import { MeshVertices } from './MeshVertices'

export class Mesh {
  public xPosition: number = 0
  public yPosition: number = 0
  public zPosition: number = 0

  public xRotation: number = 0
  public yRotation: number = 0
  public zRotation: number = 0

  private readonly vertices: MeshVertices

  constructor (vertices: MeshVertices) {
    this.vertices = vertices
  }

  public getMeshVertices (): MeshVertices {
    return this.vertices
  }

  public setPosition (x: number, y: number, z: number): void {
    this.xPosition = x
    this.yPosition = y
    this.zPosition = z
  }
}
