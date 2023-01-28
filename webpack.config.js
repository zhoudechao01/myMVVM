// 引入包
const path = require('path')
// 引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin')
// webpack中的所有配置信息都应该写在module.exports中
module.exports = {
  // 指定项目的开发模式
  mode: "development",
  // 指定项目的入口文件
  entry: './src/index.js',
  // 指定文件打包之后的目录
  output: {
    // 指定打包文件的目录
    path: path.resolve(__dirname, 'dist'),
    // 指定打包后的文件名
    filename: 'bundle.js',
    // 更新的时候删除路径下的原有文件
    clean: true,
  },

  // 指定webpack打包时要使用的模块
  module: {
    // 指定加载的规则
    rules: [
      {
        // test指定规则生效的文件
        test: /\.ts$/,
        // 要使用的loader
        use: 'ts-loader',
        // 要排除的文件
        exclude: /node_modules/
      }
    ]
  },

  // 配置webpack插件
  plugins: [
    new HTMLWebpackPlugin({
      // title:'实现一个简单的MVVM框架',
      template: './index.html'
    }),
  ],

  // 用来设置引用模块
  resolve: {
    // .ts和.js 结尾的文件都可以作为模块使用
    extensions: ['.ts', '.js']
  }
}