# nextjs-starter-kit
Next.js + Antd + MobX + react-intl + Typescript starter kit.


Table of Contents
-----------------
1. [Step1: Create an empty Next.js project](#step1-create-an-empty-nextjs-project)
1. [Step2: Ant Design](#step2-ant-design)



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

Create a file `index.js` in the project root directory with the following code:

```jsx
import Head from 'next/head'
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
    {children}
  </div>
```

Make sure the version number is the same as antd `package.json`.

Copy `./pages/index.js` from the official example to `./pages/index.js`, run `npm run dev` and go to <http://localhost:3000>.
