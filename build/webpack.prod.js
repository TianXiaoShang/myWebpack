const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const prodConfig = {
    mode: "production",                                 //生产环境，代码将被压缩(默认为production)
    devtool: 'cheap-module-source-map',                 //生产环境推荐推荐配置，单独生产map文件不增加源代码体积，但是不按F12是不会下载占用带宽的
    module: {
        rules: [                                        //众所周知use中的loader是倒着用的，所以顺序一定要注意；
            {   //file-loader
                test: /\.css$/,                         //css-loader负责整理css依赖文件，styles-loader负责挂载到html；
                use: [
                    // 'style-loader',                  //仅开发模式使用style-loader；     
                    MiniCssExtractPlugin.loader,        //该插件只能在production模式使用，用于代替style-loader，作用是单独抽离css文件，而不是放在head的style标签中；
                    'css-loader',                       //在css中不会引入stylus跟scss等，则无需关注importLoaders配置的问题；
                    {
                        loader: 'postcss-loader',       //这里的添加厂商前缀插件的方法跟下面styl写法不同，作用一样
                        options: {                      //需要的参数，放入需要依赖的厂商前缀插件
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({                         //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'html/home.html',                 //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                   //模板html，会往模板html注入js
            minify: {
                removeComments: true,                   //去掉注释   可以自己改
                collapseWhitespace: true,               //去掉空格   压缩html
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[hash].css',          //除了给css命名，还可以增加路径（这里给css创建一个单独的css文件夹）
        }),
        new CleanWebpackPlugin(),                       //用于在重新打包时删除原有代码（主要解决带hash文件没法删除的问题），开发环境不必要使用！
    ],
}

module.exports = merge(commonConfig, prodConfig)        //合并公共部分配置项
