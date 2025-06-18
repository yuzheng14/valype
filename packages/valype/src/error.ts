export class ValypeUnimplementedError extends Error {
  name = 'ValypeUnimplementedError' as const

  constructor(kind: string) {
    super(`\`${kind}\` haven't been implemented yet.`)
  }
}

export class ValypeReferenceError extends Error {
  name = 'ValypeReferenceError' as const

  constructor(name: string) {
    super(`${name} is not defined`)
  }
}

export class ValypeSyntaxError extends Error {
  name = 'ValypeSyntaxError' as const

  constructor(unexpected: string, expect: string | string[]) {
    super(
      `Unexpected ${unexpected}, expect ${Array.isArray(expect) ? expect.join(' | ') : expect}`,
    )
  }
}
