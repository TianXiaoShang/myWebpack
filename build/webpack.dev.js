const Webpack = require('webpack');       //这里主要是为了使用HotModuleReplacementPlugin,因为他是webpack自带的插件，所以这里我们引入webpack；
const HtmlWebpackPlugin = require('html-webpack-plugin')
// import HtmlWebpackPlugin from 'html-webpack-plugin'    //不能用import哦
const merge = require('webpack-merge')    //用于将公共配置与开发和生产两个环境的配置进行合并
const commonConfig = require('./webpack.common.js')


const devConfig = {
    mode: "development",          //开发版本，代码不被压缩；
    devtool: 'cheap-module-eval-source-map',         //源映射;在打包后的代码中对源代码进行映射便于报错时候的行数快速定位

    plugins: [
        new HtmlWebpackPlugin({                         //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'index.html',                     //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                   //模板html，会往模板html注入js
            minify: {
                removeComments: true,                   //去掉注释   可以自己改
                collapseWhitespace: true,               //去掉空格   压缩html
            }
        }),
        new Webpack.HotModuleReplacementPlugin(),       //使用HMR技术，用于支持热更新；需要配置hot
    ],

    // 讲了一大堆，结果production模式会自动配置tree shaking，所以仅在开发模式使用配置就行！但是sideEffects还是要配置！
    optimization:{                
        usedExports:true        
    },                         

    // 使用webpack提供的devserver(npm install webpack-dev-server -D)
    devServer: {
        port: '8082',                                    //配置端口号
        contentBase: 'dist',                             //配置开启的服务器的根路径为当前路径下的dist文件夹
        hot: true,                                       //开启HMR的热更新，
        // hotOnly: true,                                //配合hot使用，阻止更改代码后自动刷新，即使HMR没有生效；(建议关闭，对于js更新不友好，一般来讲js改变后我希望刷新页面)
        // open:true,                                    //自动打开浏览器（当然如果在package.json中配置了 webpack-dev-server --open则不用额外配置open）
        proxy: {                                         //跨域反向代理配置
            '/api': 'http://localhost:3000'              //拦截跨域请求，请求api时转到请求配置的服务器地址；
        }
    }
}

module.exports = merge(commonConfig, devConfig)
