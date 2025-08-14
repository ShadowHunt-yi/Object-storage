module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
      }
    }]
  ],
  plugins: [
    ['import', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk'
    }]
  ]
}
