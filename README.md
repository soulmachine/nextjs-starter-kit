# nextjs-starter-kit
Next.js + Antd + MobX + react-intl + Typescript starter kit.


Table of Contents
-----------------
1. [Step1: Create an empty Next.js project](#step1-create-an-empty-nextjs-project)
1. [Step2: Ant Design](#step2-ant-design)
1. [Step3: MobX](#step3-mobx)
1. [Step4: React Intl](#step4-react-intl)



# Step1: Create an empty Next.js project

Create an empty npm project,

    npm init

Fill in some information then we get a `package.json` file:


```json
{
  "name": "nextjs-starter-kit",
  "version": "1.0.0",
  "description": "Next.js starter kit",
  "author": "soulmachine@gmail.com",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/soulmachine/nextjs-starter-kit.git"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Install Next.js,

    npm install next react react-dom --save

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```

Finally we get a complete package.json file:

```json
{
  "name": "nextjs-starter-kit",
  "version": "1.0.0",
  "description": "Next.js starter kit",
  "author": "soulmachine@gmail.com",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/soulmachine/nextjs-starter-kit.git"
  },
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^4.1.4",
    "react": "^16.2.0",
    "react-dom": "^16.2.0"
  }
}
```

Create a file `./pages/index.js` inside your project:

    export default () => <div>Welcome to next.js!</div>


and then just run `npm run dev` and go to <http://localhost:3000>.


# Step2: Ant Design

There are two hight quality React UI libaries, [ant-design](https://github.com/ant-design/ant-design) and [material-ui](https://github.com/mui-org/material-ui), I choose ant-design because:

* Ant Design supports react-native officially, [ant-mobile](https://github.com/ant-design/ant-design-mobile), while [material-ui doesn't yet](https://github.com/mui-org/material-ui/issues/593)
* material-ui hasn't reached to 1.0 yet


## 2.1 Install antd

    npm install antd --save


## 2.2 Use modularized antd

Install the Babel plugin `babel-plugin-import`,

    npm install babel-plugin-import --save-dev

Enable it in `.babelrc`, the `.babelrc` file is copied from the official example, [next.js/examples/with-ant-design/.babelrc](https://github.com/zeit/next.js/blob/canary/examples/with-ant-design/.babelrc)

```json
{
  "presets": ["next/babel"],
  "plugins": [
    ["import", { "libraryName": "antd", "style": false }]
  ]
}
```


## 2.3 Import Antd CSS

Note that although we've enabled the plugin, but we pass `false` to the plugin's config to tell it to skip all CSS from antd, instead we'll load antd's css from CDN. This ugly solution is due to the issue that Next.js can only import CSS using [styled-jsx](https://github.com/zeit/styled-jsx) or CSS-in-JS built in with jsx syntax and Next.js is not able to use css-loader. See the warning from official page <https://github.com/zeit/next.js/#customizing-webpack-config>:

> Warning: Adding loaders to support new file types (css, less, svg, etc.) is not recommended because only the client code gets bundled via webpack and thus it won't work on the initial server rendering. Babel plugins are a good alternative because they're applied consistently between server/client rendering

Also see this issue [Work with antd? · Issue #484](https://github.com/zeit/next.js/issues/484) and this [Importing CSS files? · Issue #544](https://github.com/zeit/next.js/issues/544).

Create a file `./components/Layout.js` in the project root directory with the following code:

```jsx
import Head from 'next/head'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

export default ({ children }) =>
  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/2.13.10/antd.min.css' />
    </Head>
    <style jsx global>{`
      body {
      }
    `}</style>
    <LocaleProvider locale={enUS}>
      <div>{children}</div>
    </LocaleProvider>
  </div>
```

Make sure the version number is the same as antd `package.json`.

Copy `./pages/index.js` from the official example to `./pages/antd.js`(remove LocaleProvider from it), and add a link to `./pages/index.js`:

```jsx
import React from 'react'
import Link from 'next/link'

export default () => <div>
  <p>Welcome to next.js!</p>
  <Link href='/antd'><a>Ant Design</a></Link>
</div>
```

run `npm run dev` and go to <http://localhost:3000>.


# Step3: MobX

See the official example [examples/with-mobx-state-tree](https://github.com/zeit/next.js/tree/master/examples/with-mobx-state-tree).


## 3.1 Install mobx, mobx-react and mobx-state-tree

    npm install mobx mobx-react mobx-state-tree --save


## 3.2 Decorator support

Decorator support is activated by the Babel plugin `babel-plugin-transform-decorators-legacy`,

    npm install babel-plugin-transform-decorators-legacy --save-dev

Add this plugin to `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [
    "transform-decorators-legacy",
    ["import", { "libraryName": "antd", "style": false }]
  ]
}
```

## 3.3 server.js

From mobx-react's official document here, [Server Side Rendering with useStaticRendering](https://github.com/mobxjs/mobx-react#server-side-rendering-with-usestaticrendering):

> When using server side rendering, normal lifecycle hooks of React components are not fired, as the components are rendered only once. Since components are never unmounted, observer components would in this case leak memory when being rendered server side. To avoid leaking memory, call useStaticRendering(true) when using server side rendering. This makes sure the component won't try to react to any future data changes.

We need to customize  `server.js` for Next.js:

```javascript
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const mobxReact = require('mobx-react')
const app = next({ dev })
const handle = app.getRequestHandler()

mobxReact.useStaticRendering(true)

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
```

And we need to update commands in `scripts`:

```json
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  },
```


## 3.4 ClockStore

Create a file `./stores/ClockStore.js`:

```javascript
import { types, applySnapshot } from "mobx-state-tree"

const ClockStore = types
  .model({
    lastUpdate: types.Date,
    light: types.boolean,
  })
  .actions((self) => {
    let timer;
    function start() {
      timer = setInterval(() => {
        // mobx-state-tree doesn't allow anonymous callbacks changing data
        // pass off to another action instead
        self.update();
      })
    }

    function update() {
      self.lastUpdate = Date.now()
      self.light = true
    }

    function stop() {
      clearInterval(timer);
    }

    return { start, stop, update }
  })

let clockStore = null

export default function initClockStore(isServer, snapshot = null) {
  if (isServer) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false })
  }
  if (clockStore === null) {
    clockStore = ClockStore.create({ lastUpdate: Date.now(), light: false  })
  }
  if (snapshot) {
    applySnapshot(clockStore, snapshot)
  }
  return clockStore
}
```

The trick here for supporting universal mobx is to separate the cases for the client and the server. When we are on the server we want to create a new store every time, otherwise different users data will be mixed up. If we are in the client we want to use always the same store. That's what we accomplish on `ClockStore.js`.


## 3.5 ClockPage

Now let's add a new page for Clock.

First create a stateless Component in `./components/Clock.js`, just copy [examples/with-mobx-state-tree/components/Clock.js](https://github.com/zeit/next.js/blob/master/examples/with-mobx-state-tree/components/Clock.js).

Second, create a container for Clock in `./containers/Clock.js`:

```jsx
import React from 'react'
import { inject, observer } from 'mobx-react'
import Clock from '../components/Clock'

@inject('clock') @observer
class ClockContainer extends React.Component {
  componentDidMount() {
    this.props.clock.start()
  }

  componentWillUnmount() {
    this.props.clock.stop()
  }

  render() {
    return (
      <Clock lastUpdate={this.props.clock.lastUpdate} light={this.props.clock.light} />
    )
  }
}

export default ClockContainer
```

Third, create a new page `./pages/clock.js`:

```jsx
import React from 'react'
import Link from 'next/link'
import { Provider } from 'mobx-react'
import { getSnapshot } from 'mobx-state-tree'
import initClockStore from '../stores/ClockStore'
import Clock from '../containers/Clock'

class ClockPage extends React.Component {
  static getInitialProps({ req }) {
    const isServer = !!req
    const clockStore = initClockStore(isServer)
    return { initialState: getSnapshot(clockStore), isServer }
  }

  constructor(props) {
    super(props)
    this.clockStore = initClockStore(props.isServer, props.initialState)
  }

  render() {
    return (
      <Provider clock = {this.clockStore}>
        <div>
          <h1>Clock</h1>
          <Clock />
        </div>
      </Provider>
    )
  }
}

export default ClockPage
```

In every page that wants to use MobX, we need to wrap it in `<Provider>`, and initialize its store by calling `initClockStore()` in `getInitialProps()` and constructor.

Run `npm run dev` and go to <http://localhost:3000/clock>.


# Step4: React Intl

Internationalization is a must have for most Apps, we're going to use [react-intl](https://github.com/yahoo/react-intl) to internationalize this App.


## 4.1 Install packages

    npm install react-intl intl babel-plugin-react-intl accepts glob --save


## 4.2 server.js

On the server side we need to support server-side language negotiation, see the following code:

```javascript
// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl')
Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

const {readFileSync} = require('fs')
const {basename} = require('path')
const {createServer} = require('http')
const { parse } = require('url')
const accepts = require('accepts')
const glob = require('glob')
const next = require('next')
const mobxReact = require('mobx-react')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

mobxReact.useStaticRendering(true)

// Get the supported languages by looking for translations in the `lang/` dir.
const languages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0]
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }
  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale) => {
  return require(`./lang/${locale}.json`)
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const accept = accepts(req)
    let locale = accept.language(languages)
    locale = locale || 'en'
    req.locale = locale
    req.localeDataScript = getLocaleDataScript(locale)
    req.messages = getMessages(locale)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
```


## 4.3 \_document.js

We need to inject the script `localeDataScript()` from react-intl to every page, so `./pages/_document.js` comes to help:

```jsx
import Document, {Head, Main, NextScript} from 'next/document'

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
  static async getInitialProps (context) {
    const props = await super.getInitialProps(context)
    const {req: {locale, localeDataScript}} = context
    return {
      ...props,
      locale,
      localeDataScript
    }
  }

  render () {
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
              __html: this.props.localeDataScript
            }}
          />
          <NextScript />
        </body>
      </html>
    )
  }
}
```


## 4.4 PageWithIntl HOC

```jsx
import React, {Component} from 'react'
import {IntlProvider, addLocaleData, injectIntl} from 'react-intl'

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

export default (Page) => {
  const IntlPage = injectIntl(Page)

  return class PageWithIntl extends Component {
    static async getInitialProps (context) {
      let props
      if (typeof Page.getInitialProps === 'function') {
        props = await Page.getInitialProps(context)
      }

      // Get the `locale` and `messages` from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const {req} = context
      const {locale, messages} = req || window.__NEXT_DATA__.props

      // Always update the current time on page load/transition because the
      // <IntlProvider> will be a new instance even with pushState routing.
      const now = Date.now()

      return {...props, locale, messages, now}
    }

    render () {
      const {locale, messages, now, ...props} = this.props
      return (
        <IntlProvider locale={locale} messages={messages} initialNow={now}>
          <IntlPage {...props} />
        </IntlProvider>
      )
    }
  }
}
```


## 4.5 Create a testing page

Let's create a testing page `./pages/react-intl.js`:

```
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
```


## 4.6 Messages files

Create a directory `./lang`, put messages files here.

`./lang/en.json`:

```json
{
  "description": "An example app integrating React Intl with Next.js",
  "greeting": "Hello, World!"
}
```

`./lang/fr.json`:

```json
{
  "description": "Un exemple d'application intégrant React Intl avec Next.js",
  "greeting": "Bonjour le monde!"
}
```

`./lang/zh.json`:

```json
{
  "description": "一个将React Intl 与 Next.js 集成的例子",
  "greeting": "你好，世界！"
}
```

Run `npm run dev` and go to <http://localhost:3000/clock>.


## 4.7 babel-plugin-react-intl

`babel-plugin-react-intl` is a plugin that extracts string messages for translation from modules that use React Intl. To make it work we need to configure it.

First enable it in `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [
    "transform-decorators-legacy",
    ["import", { "libraryName": "antd", "style": false }]
  ],
  "env": {
    "development": {
      "plugins": [
        "react-intl"
      ]
    },
    "production": {
      "plugins": [
        ["react-intl", {
          "messagesDir": "lang/.messages/"
        }]
      ]
    }
  }
}
```

`"messagesDir": "lang/.messages/"` means this will output a `.json` file corresponding to each component from which React Intl messages were extracted.

Add `lang/.messages/` to the file `.gitignore`.

Then we write a script to merge all files under "lang/.messages/" to a single json file `./lang/en.json`:

```javascript
const {readFileSync, writeFileSync} = require('fs')
const {resolve} = require('path')
const glob = require('glob')

const defaultMessages = glob.sync('./lang/.messages/**/*.json')
  .map((filename) => readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((messages, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (messages.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`)
      }
      messages[id] = defaultMessage
    })
    return messages
  }, {})

writeFileSync('./lang/en.json', JSON.stringify(defaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve('./lang/en.json')}"`)
```

And add this script to the `build` command in `package.json`:

    "build": "next build && node ./scripts/default-lang",

Run `npm run build` and you will see it generates a file `./lang/en.json`.


## 4.8 Antd LocaleProvider

This step is optional unless we want internationalize Antd's builtin strings.

In `server.js` we load :

```javascript
const antdLocaleCache = new Map()
const rootToLang = {
  'ar': 'ar_EG',
  'bg': 'bg_BG',
  'ca': 'ca_ES',
  'cs': 'cs_CZ',
  'de': 'de_DE',
  'el': 'el_GR',
  'en': 'en_US',
  'es': 'es_ES',
  'et': 'et_EE',
  'fa': 'fa_IR',
  'fi': 'fi_FI',
  'fr': 'fr_FR',
  'is': 'is_IS',
  'it': 'it_IT',
  'ja': 'ja_JP',
  'ko': 'ko_KR',
  'nb': 'nb_NO',
  'nl': 'nl_NL',
  'pl': 'pl_PL',
  'pt': 'pt_PT',
  'ru': 'ru_RU',
  'sk': 'sk_SK',
  'sr': 'sr_RS',
  'sv': 'sv_SE',
  'th': 'th_TH',
  'tr': 'tr_TR',
  'uk': 'uk_UA',
  'vi': 'vi_VN',
  'zh': 'zh_CN'
}
const getAntdLocaleData = (locale) => {
  const root = locale.split('-')[0]
  const lang = rootToLang[root]
  if (!antdLocaleCache.has(lang)) {
    const localeData = require(`antd/lib/locale-provider/${lang}`)
    antdLocaleCache.set(lang, localeData)
  }
  return antdLocaleCache.get(lang)
}
```

And we need to wrap `PageWithIntl.js` with Antd `LocaleProvider`:

```diff
diff --git a/step4/components/PageWithIntl.js b/step4/components/PageWithIntl.js
index 1bcf0af..cd45005 100644
--- a/step4/components/PageWithIntl.js
+++ b/step4/components/PageWithIntl.js
@@ -1,5 +1,6 @@
 import React, {Component} from 'react'
 import {IntlProvider, addLocaleData, injectIntl} from 'react-intl'
+import LocaleProvider from 'antd/lib/locale-provider';
 
 // Register React Intl's locale data for the user's locale in the browser. This
 // locale data was added to the page by `pages/_document.js`. This only happens
@@ -23,21 +24,23 @@ export default (Page) => {
       // Get the `locale` and `messages` from the request object on the server.
       // In the browser, use the same values that the server serialized.
       const {req} = context
-      const {locale, messages} = req || window.__NEXT_DATA__.props
+      const {locale, messages, antdLocale} = req || window.__NEXT_DATA__.props
 
       // Always update the current time on page load/transition because the
       // <IntlProvider> will be a new instance even with pushState routing.
       const now = Date.now()
 
-      return {...props, locale, messages, now}
+      return {...props, locale, messages, antdLocale, now}
     }
 
     render () {
-      const {locale, messages, now, ...props} = this.props
+      const {locale, messages, antdLocale, now, ...props} = this.props
       return (
-        <IntlProvider locale={locale} messages={messages} initialNow={now}>
-          <IntlPage {...props} />
-        </IntlProvider>
+        <LocaleProvider locale={ antdLocale }>
+          <IntlProvider locale={locale} messages={messages} initialNow={now}>
+            <IntlPage {...props} />
+          </IntlProvider>
+        </LocaleProvider>
       )
     }
   }
```


# References

* [next.js/examples](https://github.com/zeit/next.js/tree/canary/examples)
* [Use with React Router 4 · Issue #1632 · zeit/next.js](https://github.com/zeit/next.js/issues/1632)
* [Allow custom extensions by nelak · Pull Request #2699 · zeit/next.js](https://github.com/zeit/next.js/pull/2699)
* [next.js/examples/with-typescript at master · zeit/next.js](https://github.com/zeit/next.js/tree/master/examples/with-typescript)
* [Revision of with-mobx example by michaelsbradleyjr · Pull Request #3260 · zeit/next.js](https://github.com/zeit/next.js/pull/3260)
