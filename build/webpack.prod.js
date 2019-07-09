const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const merge = require('webpack-merge')
// const commonConfig = require('./webpack.common.js')

const prodConfig = {
    mode: "production",                          //生产环境，代码将被压缩(默认为production)
    devtool: 'cheap-module-source-map',          //生产环境推荐推荐配置，单独生产map文件不增加源代码体积，但是不按F12是不会下载占用带宽的
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
    optimization:{
        // minimizer:[new optimizeCssAssetsWebpackPlugin({})],  //用于压缩和合并css代码的插件，记得传一个空对象；                
        // splitChunks:{                      
        //     cacheGroups: {                 //添加一个styles组来配置css的chunk；
        //         styles: {               //MiniCssExtractPlugin的底层也依赖splitChunks，所以这里可以配置css的chunk情况；detail see 
        //             name:'styles',
        //             test: /\.css$/,  
        //             chunks:'all',    
        //             enforce:true
        //         }
        //     }
        // }
    },
    performance:false,
    plugins: [
        new CleanWebpackPlugin(),                //用于在重新打包时删除原有代码，开发环境储存在内存中，其实开发环境没必要删除；（主要解决带hash文件没法替换的问题,另外最新版本已经不需要再基础的配置）！
        new MiniCssExtractPlugin({               //该插件只能在production模式使用，用于代替style-loader，作用是单独抽离css文件，而不会放在head的style标签中；
            filename: 'css/[name]_[contenthash].css',   //除了给css命名，还可以增加路径（这里给css创建一个单独的css文件夹）
            chunkFilename:'css/[name]_[contenthash].chunk.css'
        }),
        new HtmlWebpackPlugin({                  //此处注释见开发环境配置，以开发环境配置为主，不重复注释
            filename: 'html/home.html',           
            template: './index.html',            
            minify: {
                removeComments: true,                
                collapseWhitespace: true,             
            }
        }),
        new BundleAnalyzerPlugin({               //用于生成打包详情可视化预览图；detail see: https://github.com/webpack-contrib/webpack-bundle-analyzer
            analyzerMode:'disabled',             //默认server模式在服务器下打开，可以选择static模式生成静态html,或者disabled禁用；
            generateStatsFile:false,             //默认fale，开启后，会生成state.json文件，也可以直接在命令行生成，详情见package.json中build命令orwebpack.md；
            statsFilename:'../state.json'        //生成stats文件名，可以包含路径，只有generateStatsFile为true时有效；
        })                     
    ],
}

// module.exports = merge(prodConfig, commonConfig)    //使用全局变量控制输出模式所以注释
module.exports = prodConfig