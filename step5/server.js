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
const app = next({dev, dir: 'build'})
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
    req.antdLocale = getAntdLocaleData(locale)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
