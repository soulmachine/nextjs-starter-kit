# nextjs-starter-kit
Next.js + Antd + MobX + react-intl + Typescript starter kit.


Table of Contents
-----------------
1. [Step1: Create an empty Next.js project](#step1-create-an-empty-nextjs-project)
1. [Step2: Ant Design](#step2-ant-design)
1. [Step3: MobX](#step3-mobx)



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

Create a file `./components/layout.js` in the project root directory with the following code:

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
    light: false,
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
    clockStore = ClockStore.create({ lastUpdate: Date.now() })
  }
  if (clockStore === null) {
    clockStore = ClockStore.create({ lastUpdate: Date.now() })
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
