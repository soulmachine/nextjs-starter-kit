# nextjs-starter-kit
Next.js + Antd + MobX + react-intl + Typescript starter kit.


Table of Contents
-----------------
1. [Step1: Create an empty Next.js project](#step1-create-an-empty-nextjs-project)



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

