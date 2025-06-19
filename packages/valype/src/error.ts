import type { Span } from 'oxc-parser'

class ValypeError extends Error {
  name = 'ValypeError'
  span: Span

  constructor(message: string, span: Span) {
    super(message)
    this.span = span
  }
}

export class ValypeUnimplementedError extends ValypeError {
  name = 'ValypeUnimplementedError' as const

  constructor(kind: string, span: Span) {
    super(`\`${kind}\` haven't been implemented yet.`, span)
  }
}

export class ValypeReferenceError extends ValypeError {
  name = 'ValypeReferenceError' as const

  constructor(name: string, span: Span) {
    super(`${name} is not defined`, span)
  }
}

export class ValypeSyntaxError extends ValypeError {
  name = 'ValypeSyntaxError' as const

  constructor(unexpected: string, expect: string | string[], span: Span) {
    super(
      `Unexpected ${unexpected}, expect ${Array.isArray(expect) ? expect.join(' | ') : expect}`,
      span,
    )
  }
}

export function extractSpan<T extends Span>(span: T): Span {
  return {
    start: span.start,
    end: span.end,
  }
}
