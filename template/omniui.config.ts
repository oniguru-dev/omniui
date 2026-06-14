const config = {
  baseUrl: "http://localhost:8080",
  port: 8080,
  upnp: false,
  local: false,
  browser: true,

  robots: {
    crawler: 2,
    disallow: ["/api/*"],
    ignore: ["/api/*"],
  },
};

export default config;
