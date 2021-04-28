import Head from 'next/head'
import Layout from '@components/loginLayout'
import LoginBox from '@components/LoginForm'
import RegisterBox from '@components/RegisterForm'
import { useState } from 'react'

export default function Index(): JSX.Element {
  const [currentBox, setCurrentBox] = useState('login')
  return (
    <>
      <Head>
        <title>Login Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="root-container">
          <div className="box-controller">
            <div
              className={`controller ${currentBox == 'login' ? 'selected-controller' : ''}`}
              onClick={() => setCurrentBox('login')}
            >
              Login
            </div>
            <div
              className={`controller ${currentBox == 'register' ? 'selected-controller' : ''}`}
              onClick={() => setCurrentBox('register')}
            >
              Register
            </div>
          </div>
          <div className="box-container">
            {currentBox == 'login' && <LoginBox />}
            {currentBox == 'register' && <RegisterBox />}
          </div>
        </div>
      </Layout>
    </>
  )
}
