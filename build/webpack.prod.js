const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const prodConfig = {
    mode: "production",                                 //生产环境，代码将被压缩(默认为production)
    devtool: 'cheap-module-source-map',                 //生产环境推荐推荐配置，单独生产map文件不增加源代码体积，但是不按F12是不会下载占用带宽的
    module: {
        rules: [                                        
            {   //file-loader  此处注释见开发环境配置，以开发环境配置为主，不重复注释
                test: /\.css$/,                         
                use: [
                    // 'style-loader',                 
                    MiniCssExtractPlugin.loader,        
                    'css-loader',                      
                    {
                        loader: 'postcss-loader',      
                        options: {                      
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
            {   //stylus-loader   此处注释见开发环境配置，以开发环境配置为主，不重复注释
                test: /\.styl$/,                    
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,    
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,       
                            // modules: true        
                        }
                    },
                    'postcss-loader',               
                    'stylus-loader'                 
                ]
            },
            {   //url-loader  此处注释见开发环境配置，以开发环境配置为主，不重复注释
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'imgs/',                
                        publicPath: '../imgs/',           
                        limit: 8 * 1024,                  
                        name: '[name]_[hash].[ext]'   
                    }
                }
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({                      //该插件只能在production模式使用，用于代替style-loader，作用是单独抽离css文件，而不会放在head的style标签中；
            filename: 'css/[name]_[hash].css',          //除了给css命名，还可以增加路径（这里给css创建一个单独的css文件夹）
        }),
        new HtmlWebpackPlugin({                        //此处注释见开发环境配置，以开发环境配置为主，不重复注释
            filename: 'html/home.html',           
            template: './index.html',            
            minify: {
                removeComments: true,                
                collapseWhitespace: true,             
            }
        }),
    ],
}

module.exports = merge(prodConfig, commonConfig)
