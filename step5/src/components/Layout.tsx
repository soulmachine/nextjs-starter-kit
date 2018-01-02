import Head from "next/head"
import React from "react"

const Layout: React.SFC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/antd/3.0.0/antd.min.css"
      />
    </Head>
    <style jsx global>{`
      body {
      }
    `}</style>
    {children}
  </div>
)

export default Layout
