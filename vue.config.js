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

const Timestamp = new Date().getTime();
const Version = '1.0.1'
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'
const now = new Date()
const FILE_NAME = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}-${now.getMinutes()}`

module.exports = {
    publicPath: BASE_URL,
    outputDir: `dist/${FILE_NAME}`,
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: false,
    configureWebpack: { // webpack 配置
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].${Version}.${Timestamp}.js`,
            chunkFilename: `js/[name].${Version}.${Timestamp}.js`
        },
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
    },
    // 设为false打包时不生成.map文件
    productionSourceMap: false,
}