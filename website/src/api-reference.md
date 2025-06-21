# API Reference

## Schema Validation APIs

### `validate${schemaName}`

```typescript
function validate${schemaName}(data: unknown): ZodIssue[] | undefined
```

Validates data against the schema. Returns:

- `undefined` if validation passes
- Array of `ZodIssue` objects if validation fails

Example:

```typescript
const issues = validateUser(data)
if (issues) {
  // handle validation errors
}
```

### `is${schemaName}`

```typescript
function is${schemaName}(data: unknown): data is ${schemaName}
```

Type predicate that checks if data matches the schema. Returns `true` if valid.

Example:

```typescript
if (isUser(data)) {
  // data is now typed as User
}
```

### `assert${schemaName}`

```typescript
function assert${schemaName}(data: unknown): asserts data is ${schemaName}
```

Validates data and throws validation issues if invalid. If it returns, data is guaranteed to match the schema type.

Example:

```typescript
try {
  assertUser(data)
  // data is now typed as User
} catch (issues) {
  // handle validation errors
}
```
