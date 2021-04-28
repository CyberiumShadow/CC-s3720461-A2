import React from 'react'
import { useRouter } from 'next/router'
import useForm from '@lib/hooks/useForm'
import validate from '@lib/validationRules/RegisterFormValidationRules'

interface UseFormHook {
  values: {
    [key: string]: string
  }
  errors: {
    email?: string
    username?: string
    password?: string
    login?: string
  }
  // eslint-disable-next-line no-empty-pattern
  setErrors: ({}) => void
  handleChange: (event: any) => void
  handleSubmit: (event: any) => void
  handleFile: (event: any) => void
}

const RegisterForm = (): JSX.Element => {
  const router = useRouter()
  const { values, errors, setErrors, handleChange, handleSubmit }: UseFormHook = useForm(
    postForm,
    validate
  )

  async function postForm(): Promise<void> {
    const res = await fetch('/api/users', {
      body: JSON.stringify({
        email: values.email,
        user_name: values.username,
        password: values.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const result = await res.json()

    if (res.status === 409) {
      return setErrors({ login: result.message })
    }
    return router.reload()
  }

  return (
    <div className="inner-container">
      <div className="header">Register</div>
      <small className="danger-error">{errors.login ? errors.login : ''}</small>
      <div className="box">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            className="login-input"
            placeholder="JohnsonChen"
            onChange={handleChange}
            value={values.username || ''}
            required
          />
          <small className="danger-error">{errors.username ? errors.username : ''}</small>
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
          Register
        </button>
      </div>
    </div>
  )
}

export default RegisterForm
