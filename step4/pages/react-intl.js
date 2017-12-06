import React, {Component} from 'react'
import Head from 'next/head'
import {FormattedMessage, FormattedNumber, defineMessages, FormattedRelative} from 'react-intl'
import pageWithIntl from '../components/PageWithIntl'
import Layout from '../components/Layout'

const {description} = defineMessages({
  description: {
    id: 'description',
    defaultMessage: 'An example app integrating React Intl with Next.js'
  }
})

class ReactIntlPage extends Component {
  static async getInitialProps ({req}) {
    return {someDate: Date.now()}
  }

  render () {
    return (
      <Layout title="React Intl">
        <Head>
          <meta name='description' content={this.props.intl.formatMessage(description)} />
        </Head>
        <p>
          <FormattedMessage id='greeting' defaultMessage='Hello, World!' />
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
