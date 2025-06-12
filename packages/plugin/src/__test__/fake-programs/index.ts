// @ts-expect-error - it should exist
import { validateUser } from './test.valype'

const result = validateUser({
  name: 'John Doe',
})

console.log(result)
