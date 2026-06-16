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

  robots: {
    crawler: 2,
    disallow: [ "/api/*" ],
    ignore: [ "/api/*" ]
  },

  rateLimit: {
    max: 127,
    duration: 60000,
    routes: {
      "/_bun/rsc": { max: 15, duration: 60000 }
    }
  },
};

export default config;
