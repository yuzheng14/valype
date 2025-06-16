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
