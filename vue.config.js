module.exports = {
  devServer: {
    proxy: {
      '^/play': {
        target: 'ws://localhost:3000',
        ws: true,
      },
      '/': {
        target: 'http://localhost:3000',
        ws: false,
      },
    },
  },
}
