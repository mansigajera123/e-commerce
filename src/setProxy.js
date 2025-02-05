const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/", // Proxy all API requests to the backend
    createProxyMiddleware({
      target: "https://pink-places-build.loca.lt", // Your backend's local URL
      changeOrigin: true,
    })
  );
};
