const Webpack = require('webpack');       //这里主要是为了使用HotModuleReplacementPlugin,因为他是webpack自带的插件，所以这里我们引入webpack；
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')    //用于将公共配置与开发和生产两个环境的配置进行合并
const autoprefixer = require('autoprefixer')
const commonConfig = require('./webpack.common.js')
// import HtmlWebpackPlugin from 'html-webpack-plugin'    //不能用import哦

const devConfig = {
    mode: "development",          //开发版本，代码不被压缩；
    devtool: 'cheap-module-eval-source-map',         //源映射;在打包后的代码中对源代码进行映射便于报错时候的行数快速定位
        //总结来讲，development推荐cheap-module-eval-source-map，production推荐cheap-module-source-map（线上环境有正确的报错也便于调试，当然如果你完全不需要在线上定位报错则用none或者直接注释掉即可）
        //值得注意的是，不管使用哪种模式，当有产生.map文件时，.map文件只会在F12开启时进行下载（sourceMap主要服务于调试），所以其实更推荐使用单独生成.map文件的形式。否则放到js中会增加代码体积，也就是说避免使用inline
        //none，不触发sourceMap（拓展：https://www.cnblogs.com/chris-oil/p/8856020.html）
        //source-map进行源代码映射可以在报错中正确显示其在源代码中的行数，但会导致打包速度变慢，因为需要生成映射map文件
        //inline-source-map,跟source-map唯一不同的是不会单独生成map文件，会以base64格式放在打包后的js中；
        //cheap-inline-source-map,加上cheap则只会告诉你第几行，不会告诉你第几列（或者说第几个字符）出错，省性能；
        //cheap-module-inline-source-map,加上module代表不止管业务代码，依赖的包中的报错也能帮你定位；
        //eval，不生成map文件，以eval的方式生成对应关系，性能最佳，但是提示信息不够全；
    
    module: {
        rules: [                                     //众所周知use中的loader是倒着用的，所以顺序一定要注意；
            {   //file-loader
                test: /\.css$/,                      //css-loader负责整理css依赖文件，styles-loader负责挂载到html；
                use: [
                    'style-loader',                  //开发模式使用style-loader；     
                    // MiniCssExtractPlugin.loader,  //该插件只在production模式使用，因为他不支持HMR而影响开发效率，用于代替style-loader，作用是单独抽离css文件，而不是放在head的style标签中；
                    'css-loader',                    //在css中不会引入stylus跟scss等，则无需关注importLoaders配置的问题；
                    {
                        loader: 'postcss-loader',    //这里的添加厂商前缀插件的方法跟下面styl写法不同，作用一样
                        options: {                   //需要的参数，放入需要依赖的厂商前缀插件
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
            {   //stylus-loader
                test: /\.styl$/,                    //stylus文件编译成普通css文件(npm i stylus stylus-loader --save)
                use: [
                    'style-loader',
                    // MiniCssExtractPlugin.loader, //该插件只能在production模式使用，用于代替style-loader，作用是单独抽离css文件，而不是放在head的style标签中；
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,       //这个配置为了防止在stylus文件中嵌套的使用@import引入新的文件，不会再走下面的stylus-loader等两个loader环节引发的问题
                            // modules: true        //使用模块化css，使用之后需要通过import style from 'xxx';img.calssList.add(style.avatar)这样的方式针对局部使用该样式文件；目的是不影响全局样式，鸡肋！
                        }
                    },
                    'postcss-loader',               //这种写法需要另建postcss.config.js文件来配置，不如上方直接在options中配置
                    'stylus-loader'                 //npm i stylus stylus-loader --save
                ]
            },
            {   //url-loader   内置了file-loader，当超过limit规定的大小，则使用file-loader，会将匹配的文件复制到规定的imgs目录
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'imgs/',                //图片的输出地址，相对于output.path的地址（也就是输出文件夹下创建一个imgs文件夹存放图片）
                        publicPath: './imgs/',              //引用该文件的路径。
                        limit: 8 * 1024,                    //限制文件的大小 8k
                        name: '[name]_[hash].[ext]'         //打包后的命名规则
                    }
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({                         //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'index.html',                     //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                   //模板html，会往模板html注入js
            minify: {
                removeComments: true,                   //去掉注释   可以自己改
                collapseWhitespace: true,               //去掉空格   压缩html
            }
        }),
        new Webpack.HotModuleReplacementPlugin(),       //使用HMR技术，用于支持热更新；需要在devServer中配置hot
        // -->对于css，样式改变不需要刷新页面，自动替换；
        // -->对于js，可以在入口文件中对不同模块进行监听处理；如下代码（index.js）：
        // 总结来讲对css是神器，对js略鸡肋，但事实上css只是css-loader帮我们把下面这种繁琐的事情做了，而js只能手写。而在vue中vue-loader也帮我们做了这种事。不需要手动写callback；
        //  if(module.hot){        //在开启hot的情况下，监听引入的number模块，当模块发生变化，执行callback；
        //      module.hot.accept('./number', () => {
        //         // do something
        //      })
        //  } 
    ],
    

    


    // 使用webpack提供的devserver(npm install webpack-dev-server -D)
    devServer: {
        port: '8085',                                    //配置端口号
        contentBase: 'dist',                             //配置开启的服务器的根路径为当前路径下的dist文件夹
        hot: true,                                       //开启HMR的热更新，
        // hotOnly: true,                                //配合hot使用，阻止更改代码后自动刷新，即使HMR没有生效；(建议关闭，对于js更新不友好，一般来讲js改变后我希望刷新页面)
        // open:true,                                    //自动打开浏览器（当然如果在package.json中配置了 webpack-dev-server --open则不用额外配置open）
        proxy: {                                         //跨域反向代理配置
            '/api': 'http://localhost:3000'              //拦截跨域请求，请求api时转到请求配置的服务器地址；
        }
    }
}

module.exports = merge(commonConfig, devConfig)          //合并公共部分配置项
