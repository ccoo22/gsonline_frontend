const { defineConfig } = require('@vue/cli-service')
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// cdn URL
const CDN = {
  css: [
    'https://unpkg.com/element-plus@2.2.21/dist/index.css'
  ],
  js: [
    'https://unpkg.com/vue@3.2.45/dist/vue.global.js',
    'https://unpkg.com/element-plus@2.2.21/dist/index.full.js',
	'https://unpkg.com/@element-plus/icons-vue@2.0.10/dist/index.iife.min.js'
  ]
};

// 生产环节不编译的模块
let objExternals = {
  vue: 'Vue',
  'element-plus': 'ElementPlus',
  '@element-plus/icons-vue': 'ElementPlusIconsVue'
}
 
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  productionSourceMap: false,
  configureWebpack: config => {
          // 生产环境相关配置
          if (isProduction) {
              //gzip压缩
              const productionGzipExtensions = ['html', 'js', 'css']
              config.plugins.push(
                  new CompressionWebpackPlugin({
                      filename: '[path][base].gz',
                      algorithm: 'gzip',
                      test: new RegExp(
                          '\\.(' + productionGzipExtensions.join('|') + ')$'
                      ),
                      threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                      minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                      deleteOriginalAssets: false // 删除原文件
                  })
              )
			  // 因为使用了CDN, 这里要排除一些需要编译的模块
			  config.externals = objExternals
          }
      },
	chainWebpack: config => {
	  	// 配置，将当前页定义的cdn值传到主页面（index.html）
	    config.plugin('html').tap(args => {
	    // 这里我是除本地环境，其余均使用CDN，可自己选择是否配置
	      args[0].cdn = process.env.VUE_APP_STAGE === 'LOCAL' ? {} : CDN
	      return args;
	    });
	  } 
})


 
 