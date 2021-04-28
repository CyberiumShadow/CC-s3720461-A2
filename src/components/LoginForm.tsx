import React from 'react'
import useForm from '@lib/hooks/useForm'
import validate from '@lib/validationRules/LoginFormValidationRules'
import fetchJson from '@lib/fetchJson'
import useUser from '@lib/hooks/useUser'

interface UseFormHook {
  values: {
    [key: string]: string
  }
  errors: {
    login?: string
    email?: string
    password?: string
  }
  // eslint-disable-next-line no-empty-pattern
  setErrors: ({}) => void
  handleChange: (event: any) => void
  handleSubmit: (event: any) => void
  handleFile: (event: any) => void
}

const LoginForm = (): JSX.Element => {
  const { values, errors, setErrors, handleChange, handleSubmit }: UseFormHook = useForm(
    postForm,
    validate
  )
  const { mutateUser } = useUser({
    redirectTo: '/home',
    redirectIfFound: true,
  })

  async function postForm(): Promise<boolean | void> {
    try {
      const res = await fetchJson('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })
      await mutateUser(res)
      if (res.status === 401) {
        return setErrors({ login: res.message })
      }
    } catch (error) {
      return setErrors({ login: error.message })
    }
  }

  return (
    <div className="inner-container">
      <div className="header">Login</div>
      <small className="danger-error">{errors.login ? errors.login : ''}</small>
      <div className="box">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            className="login-input"
            placeholder="s3720461@student.rmit.edu.au"
            onChange={handleChange}
            value={values.email || ''}
            required
          />
          <small className="danger-error">{errors.email ? errors.email : ''}</small>
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            onChange={handleChange}
            value={values.password || ''}
            required
          />
          <small className="danger-error">{errors.password ? errors.password : ''}</small>
        </div>
        <button type="button" className="login-btn" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  )
}

export default LoginForm
