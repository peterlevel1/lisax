
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      title: 'apx',
      dll: true,
      routes: {
        exclude: [],
      },
      hardSource: true,
    }],
    'babel-plugin-transform-runtime',
    'babel-plugin-transform-decorators-legacy',
    // ['babel-plugin-import', { libraryName: 'antd', style: true }],
  ],

  theme: './src/theme.js',

  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },

    '/res': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },

  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV
  }
}
