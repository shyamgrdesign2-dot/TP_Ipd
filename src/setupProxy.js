const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy shared-ui remote to avoid CORS in local dev when testing IPD env
  if (process.env.REACT_APP_ENV === 'ipd') {
    app.use(
      '/shared-ui',
      createProxyMiddleware({
        target:
          'https://pm-storybook-ui-uat.kindmushroom-6f77b425.centralindia.azurecontainerapps.io',
                  changeOrigin: true,
        secure: true,
        ws: false,
        pathRewrite: {
          '^/shared-ui': '/',
        },
        headers: {
          Host:
            'pm-storybook-ui-uat.kindmushroom-6f77b425.centralindia.azurecontainerapps.io',
        },
      })
    );
  } else if (process.env.REACT_APP_ENV === 'prod') {
    app.use(
      '/shared-ui',
      createProxyMiddleware({
        target:
          // 'https://pm-storybook-ui-uat.kindmushroom-6f77b425.centralindia.azurecontainerapps.io',
          "https://pm-storybook-ui-prod.tatvacare.in",
        changeOrigin: true,
        secure: true,
        ws: false,
        pathRewrite: {
          '^/shared-ui': '/',
        },
        headers: {
          Host:
            'pm-storybook-ui-prod.tatvacare.in',
        },
      })
    );
  }
};


