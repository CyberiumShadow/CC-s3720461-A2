import 'bootstrap/dist/css/bootstrap.min.css'
import '@styles/global.scss'
import React from 'react'
import { SWRConfig } from 'swr'
import type { AppProps } from 'next/app'
import fetch from '@lib/fetchJson'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}
