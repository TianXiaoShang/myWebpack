const path = require("path")
const autoprefixer = require('autoprefixer')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const glob = require('glob-all');  
const Webpack = require('webpack');  
const HtmlWebpackPlugin = require('html-webpack-plugin')
// import HtmlWebpackPlugin from 'html-webpack-plugin'

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry:{
        index:'./src/js/index.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),              //dirname代表当前配置文件所在的目录，也就是根目录，在此根目录下创建子文件夹dist为打包后的文件路径；
        filename: "js/[name]_[hash].boundle.js"           //除了明明，可以在前面加路径名，创建文件夹，增加相对打包出来的dist的路径；
    },
    mode:"development",           //开发版本，代码不被压缩；
    // mode:"production",         //生产版本，代码将被压缩(默认为production)
    module:{ 
        rules: [                                     //众所周知use中的loader是倒着用的，所以顺序一定要注意；
            { 
                test: /\.css$/,                      //css-loader负责整理css依赖文件，styles-loader负责挂载到html；
                use:[      
                    // 'style-loader', 
                    MiniCssExtractPlugin.loader,     //该插件代替style-loader，作用是单独抽离css文件，而不是放在head的style标签中
                    'css-loader',                    //在css中不会引入stylus跟scss等，则无需关注importLoaders配置的问题；
                    {
                        loader:'postcss-loader',     //这里的添加厂商前缀插件的方法跟下面styl写法不同，作用一样
                        options:{                    //需要的参数，放入需要依赖的厂商前缀插件
                            plugins:[autoprefixer]
                        }
                    },
                ]
            },
            {
                test: /\.styl$/,                    //stylus文件处理(npm i stylus stylus-loader --save)
                use: [
                    'style-loader',
                    {
                        loader:'css-loader',
                        options:{
                            importLoaders:2,        //这个配置为了防止在stylus文件中使用@import引入新的文件，不会再走下面的stylus-loader等两个loader环节引发的问题
                            // modules: true        //使用模块化css，使用之后需要通过import style from 'xxx';img.calssList.add(style.avatar)这样的方式针对局部使用该样式文件；目的是不影响全局样式
                        }
                    },
                    'postcss-loader',               //这种写法需要另建postcss.config.js文件来配置，不如上方直接在options中配置
                    'stylus-loader'                 //npm i stylus stylus-loader --save
                ] 
            },
            {   //url-loader   内置了file-loader，当超过limit规定的大小，则使用file-loader，会将匹配的文件复制到规定的imgs目录
                test: /\.(png|jpg|gif)$/i,
                use:{ 
                    loader:'url-loader',     
                    options:{
                        outputPath:'imgs/',                //图片的输出地址，相对于output.path的地址（也就是输出文件夹下创建一个imgs文件夹存放图片）
                        publicPath:'../imgs/',             //引用该文件的路径。
                        limit:8*1024,                      //限制文件的大小 8k
                        name:'[name]_[hash].[ext]'         //打包后的命名规则
                    }
                }
            },
            {    //bable
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            {
                test: /\.(htm|html)$/i,
                use: {
                    loader: 'html-withimg-loader', 
                  }
            }
        ],
    },
    plugins :[
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[hash].css',                  //除了给css命名，还可以增加路径（这里给css创建一个单独的css文件夹）
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync([
                path.join(__dirname, './*.html'),        //匹配html文件
                path.join(__dirname, './src/js/*.js')    //匹配js文件
           ]),
        }),
        new HtmlWebpackPlugin({                          //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'index.html',                      //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                    //模板html，会往模板html注入js
            minify: {
                removeComments:true,                     //去掉注释    可以自己改
                collapseWhitespace:true,                 //去掉空格   压缩html
            }
        }),
        new WebpackDeepScopeAnalysisPlugin(),
        new CleanWebpackPlugin(),                        //用于在重新打包时删除原有代码（主要解决带hash文件没法删除的问题），同时在运行dev服务时也会删除输出目录代码；
        new Webpack.HotModuleReplacementPlugin(),        //开启热更新 -->css实现可以实现js不行  -->需要在入口文件中添加东西
    ], 
    devServer:{ 
        port:'8082',                                     //修改端口号
        contentBase:'dist',
        hot:true,                                        //热更新为true
    }
}




