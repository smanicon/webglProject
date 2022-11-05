import { MeshVertices } from './MeshVertices'

export class TriangularPrismMeshVertices implements MeshVertices {
  vertices (): number[] {
    return [
      // front face
      // bottom left to right, to top
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      2.0, 0.0, 0.0,
      0.5, 1.0, 0.0,
      1.5, 1.0, 0.0,
      1.0, 2.0, 0.0,
      // rear face
      0.0, 0.0, -2.0,
      1.0, 0.0, -2.0,
      2.0, 0.0, -2.0,
      0.5, 1.0, -2.0,
      1.5, 1.0, -2.0,
      1.0, 2.0, -2.0
    ]
  }

  colorVertices (): number[] {
    return [
      // front face
      0.0, 0.0, 1.0,
      1.0, 1.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      1.0, 1.0, 1.0,
      // rear face
      0.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      1.0, 1.0, 1.0
    ]
  }

  UVTextureVertices (): number[] {
    return [
      // front face
      0.0, 0.0,
      1.0, 0.0,
      2.0, 0.0,
      0.5, 1.0,
      1.5, 1.0,
      1.0, 2.0,
      // rear face
      0.0, 0.0,
      1.0, 0.0,
      2.0, 0.0,
      0.5, 1.0,
      1.5, 1.0,
      1.0, 2.0
    ]
  }

  indiceVertices (): number[] {
    return [
      // front face
      0, 1, 3,
      1, 3, 4,
      1, 2, 4,
      3, 4, 5,
      // rear face
      6, 7, 9,
      7, 9, 10,
      7, 8, 10,
      9, 10, 11,
      // left side
      0, 3, 6,
      3, 6, 9,
      3, 5, 9,
      5, 9, 11,
      // right side
      2, 4, 8,
      4, 8, 10,
      4, 5, 10,
      5, 10, 11,
      // bottom faces
      0, 6, 8,
      8, 2, 0
    ]
  }
}
