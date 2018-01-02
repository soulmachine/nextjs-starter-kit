import LocaleProvider from "antd/lib/locale-provider"
import { Context } from "next"
import React, { Component } from "react"
import {
  addLocaleData,
  InjectedIntlProps,
  injectIntl,
  IntlProvider
} from "react-intl"

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== "undefined" && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach(lang => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

interface AdditionalProps {
  locale: string
  messages: object
  initialNow: Date
  antdLocale: object
}

export default function pageWithIntl<P extends InjectedIntlProps>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentClass<P & AdditionalProps> {
  const IntlPage = injectIntl(WrappedComponent)

  return class extends React.PureComponent<P & AdditionalProps> {
    public static async getInitialProps(context: Context) {
      let props
      const tmp: any = WrappedComponent
      if (typeof tmp.getInitialProps === "function") {
        props = await tmp.getInitialProps(context)
      }

      // Get the `locale` and `messages` from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = context
      const { locale, messages, antdLocale } = req || window.__NEXT_DATA__.props

      // Always update the current time on page load/transition because the
      // <IntlProvider> will be a new instance even with pushState routing.
      const initialNow = Date.now()

      return { locale, messages, initialNow, antdLocale, ...props }
    }

    public render() {
      // error TS2700: Rest types may only be created from object types.
      // see https://github.com/Microsoft/TypeScript/issues/12756#issuecomment-265812676
      // const {locale, messages, initialNow, ...props} = this.props
      const { locale, messages, initialNow, antdLocale } = this.props

      return (
        <LocaleProvider locale={antdLocale}>
          <IntlProvider locale={locale} messages={messages}>
            <IntlPage {...this.props} />
          </IntlProvider>
        </LocaleProvider>
      )
    }
  }
}
