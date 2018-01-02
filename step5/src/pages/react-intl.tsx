import { Context } from "next"
import Head from "next/head"
import React, { Component } from "react"
import {
  defineMessages,
  FormattedMessage,
  FormattedNumber,
  FormattedRelative,
  InjectedIntlProps
} from "react-intl"
import Layout from "../components/Layout"
import pageWithIntl from "../components/PageWithIntl"

const { description } = defineMessages({
  description: {
    defaultMessage: "An example app integrating React Intl with Next.js",
    id: "description"
  }
})

interface ReactIntlPageProps extends InjectedIntlProps {
  someDate: Date
}

class ReactIntlPage extends React.PureComponent<ReactIntlPageProps> {
  public static async getInitialProps(context: Context) {
    return { someDate: Date.now() }
  }

  public render() {
    return (
      <Layout title="React Intl Example">
        <Head>
          <meta
            name="description"
            content={this.props.intl.formatMessage(description)}
          />
        </Head>
        <p>
          <FormattedMessage id="greeting" defaultMessage="Hello, World!" />
        </p>
        <p>
          <FormattedNumber value={1000} />
        </p>
        <p>
          <FormattedRelative
            value={this.props.someDate}
            updateInterval={1000}
          />
        </p>
      </Layout>
    )
  }
}

export default pageWithIntl(ReactIntlPage)
