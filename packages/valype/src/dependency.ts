import type { Span } from 'oxc-parser'
import { extractSpan, ValypeCircularDependencyError } from './error'
import type { DeclarationInfo } from './context'

export interface Dependency {
  name: string
  /** position of reference */
  span: Span
}

export function extractDependency<N extends Span & { name: string }>(
  node: N,
): Dependency {
  return {
    name: node.name,
    span: extractSpan(node),
  }
}

export interface Vertex extends DeclarationInfo {
  schemaCode: string
  dependencies: string[]
}

interface VertexDuringSort extends Vertex {
  inDegree: number
  successors: string[]
}

/** maintain graph of dependencies and generate code using topological sorting */
export class DepGraph {
  private graph: Map<string, Vertex> = new Map()

  addVertex(name: string, vertex: Vertex): void {
    this.graph.set(name, vertex)
  }

  hasVertex(name: string): boolean {
    return this.graph.has(name)
  }

  /** generate code ordered by topological sort */
  generateCode(): string | ValypeCircularDependencyError {
    const schemas: string[] = []
    const sortingMap = new Map<string, VertexDuringSort>()

    this.graph.forEach((vertex) => {
      sortingMap.set(vertex.name, {
        ...vertex,
        inDegree: vertex.dependencies.length,
        successors: [],
      })
    })

    const sources: string[] = []
    sortingMap.forEach((vertex) => {
      vertex.dependencies.forEach((dep) => {
        sortingMap.get(dep)!.successors.push(vertex.name)
      })
      if (vertex.inDegree === 0) sources.push(vertex.name)
    })

    while (sources.length) {
      const vertex = sortingMap.get(sources.pop()!)!
      schemas.push(vertex.schemaCode)
      for (const successor of vertex.successors) {
        const successorVertex = sortingMap.get(successor)!
        successorVertex.inDegree--
        if (successorVertex.inDegree === 0) {
          sources.push(successor)
        }
      }
      sortingMap.delete(vertex.name)
    }

    if (sortingMap.size > 0) {
      const vertex = sortingMap.values().next().value!
      return new ValypeCircularDependencyError(vertex.name, vertex.node)
    }

    return schemas.join('')
  }
}
