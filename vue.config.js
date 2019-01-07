const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,

  outputDir: 'dist', // 构建输出目录
  assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
  // indexPath: 'index.html',//指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  filenameHashing: true,
  lintOnSave: false,
  runtimeCompiler: false,// 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度

  configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置

    console.log(config.output)
    console.log(config.entry)

    // config.output.filename= {
    //   filename: path.posix.join('static', 'js/[name].[chunkhash].js'),
    //   chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js'),
    //   publicPath: '/'
    // },
    //   config.entry = {
    //     vendors: ['vue', 'vuex', 'vue-router', 'axios', 'qs'],
    //   }
    // if (process.env.NODE_ENV !== 'production') { // 开发环境配置
    //   config.devtool = 'cheap-module-eval-source-map'
    // } else { // 生产环境配置
    // }
    // Object.assign(config, { // 开发生产共同配置
    //   resolve: {
    //     alias: {
    //       '@': path.resolve(__dirname, './src'),
    //       '@c': path.resolve(__dirname, './src/components'),
    //       'vue$': 'vue/dist/vue.esm.js'
    //     }
    //   }
    // })
  },

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  //生成别名
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'production') { // 开发环境配置
      config.devtool = 'cheap-module-eval-source-map'
    } else { // 生产环境配置
    }
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },

  pluginOptions: {
    foo: {
      // 插件可以作为 `options.pluginOptions.foo` 访问这些选项。
    }
  },

  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    host: '127.0.0.1',
    port: 9600,
    hot: true, // 启用热加载
    compress: true,
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',  // 请求本地 需要后台接口
        changeOrigin: true,
        ws: true
      }
    }
  },
}
