module.exports = {
  devServer:{
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    proxy: {
      '/apis': {
        target: 'http://127.0.0.1:7001',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': 'http://127.0.0.1:7001/apis'
        }
      }
    },
    // overlay: {
    //   warnings: false,
    //   errors: false
    // },
    // lintOnSave: false
  }
}