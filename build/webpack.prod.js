const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge')    
const commonConfig = require('./webpack.common.js')

const prodConfig =  {
    mode:"production",                                  //生产环境，代码将被压缩(默认为production)
    devtool: 'cheap-module-source-map',                 //生产环境推荐推荐配置，单独生产map文件不增加源代码体积，但是不按F12是不会下载占用带宽的
    plugins: [
        new HtmlWebpackPlugin({                         //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'html/home.html',                 //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                   //模板html，会往模板html注入js
            minify: {
                removeComments: true,                   //去掉注释   可以自己改
                collapseWhitespace: true,               //去掉空格   压缩html
            }
        }),
        new CleanWebpackPlugin(),                       //用于在重新打包时删除原有代码（主要解决带hash文件没法删除的问题），开发环境不必要使用！
    ],
}

module.exports = merge(commonConfig, prodConfig)        //合并公共部分配置项
