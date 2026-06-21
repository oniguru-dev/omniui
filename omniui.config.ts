/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 *
 * Configuration file.
 */

const config = {
  baseUrl: "http://localhost:8080",
  port: 8080,
  upnp: false,
  local: false,
  browser: true,

  rateLimit: {
    max: 127,
    duration: 60000,
    paths: {}
  },

  robots: {
    crawler: 2,
    disallow: [ "/api/*" ],
    ignore: [ "/api/*" ]
  },

  routing: {
    strictCase: false
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    cookie: "locale",
  },
};

export default config;
