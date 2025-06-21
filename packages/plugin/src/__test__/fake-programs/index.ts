// @ts-expect-error - it should exist
import { validateUser, isUser, assertUser } from './test.valype'

const result = validateUser({
  name: 'John Doe',
})
console.log(`result ==>`, result)

const is = isUser({ name: '1', age: 2, email: '3' })
console.log(`is ==>`, is)

try {
  assertUser({ message: 'What can I say? Man!' })
} catch (error) {
  console.log(`error ==>`, error)
}
