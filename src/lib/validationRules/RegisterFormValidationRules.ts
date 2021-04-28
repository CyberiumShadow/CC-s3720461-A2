export default function validate(values: Record<string, unknown>) {
  const errors: Record<string, unknown> = {}
  if (!values.email) {
    errors.email = 'Email is required'
  }
  if (!values.username) {
    errors.username = 'Username is required'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  }

  return errors
}
