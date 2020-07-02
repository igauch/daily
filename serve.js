const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api/', createProxyMiddleware({
  target: 'http://t-api.meip01.me/',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': ''
  }
}));

app.use(express.static(path.resolve(__dirname, './')));

module.exports = app.listen(8086, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + 8086 + '\n')
});
