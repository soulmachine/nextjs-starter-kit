import {Context} from "next"
import Document, {Head, Main, NextScript} from "next/document"

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
  public static async getInitialProps(context: Context) {
    const props = await context.renderPage()
    const {req: {locale, localeDataScript}} = context
    return {
      ...props,
      locale,
      localeDataScript,
    }
  }

  public render() {
    // Polyfill Intl API for older browsers
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${this.props.locale}`

    return (
      <html>
        <Head />
        <body>
          <Main />
          <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript,
            }}
          />
          <NextScript />
        </body>
      </html>
    )
  }
}
