//注意！！！！ 已弃用，采用build中的分模式开发，本配置作为备份暂时保留

const path = require("path")
const autoprefixer = require('autoprefixer')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const glob = require('glob-all');
const Webpack = require('webpack');       //这里主要是为了使用HotModuleReplacementPlugin,因为他是webpack自带的插件，所以这里我们引入webpack；
const HtmlWebpackPlugin = require('html-webpack-plugin')
// import HtmlWebpackPlugin from 'html-webpack-plugin'    //不能用import哦

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js'                         //也可以写多个入口，html引入多个打包后的js；
    },
    output: {
        // publicPath:'http://cdn.com.cn',                   //当js在另一个cdn地址上，这里将作为html引用js地址中拼接成最终的完整访问地址；如：<script src="http://cdn.com.cn/js/index.boundle.js"></script>;
        path: path.resolve(__dirname, 'dist'),              //dirname代表当前配置文件所在的目录，也就是根目录，在此根目录下创建子文件夹dist为打包后的文件路径；
        filename: "js/[name]_[hash].boundle.js"             //除了命名，可以在前面加路径名，创建文件夹，增加相对打包出来的dist的路径；
    },

    // mode:"production",         //生产版本，代码将被压缩(默认为production)
    mode: "development",          //开发版本，代码不被压缩；
    // devtool: 'cheap-module-source-map',           //生产环境推荐用这种
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
                    // 'style-loader', 
                    MiniCssExtractPlugin.loader,     //该插件代替style-loader，作用是单独抽离css文件，而不是放在head的style标签中
                    'css-loader',                    //在css中不会引入stylus跟scss等，则无需关注importLoaders配置的问题；
                    {
                        loader: 'postcss-loader',    //这里的添加厂商前缀插件的方法跟下面styl写法不同，作用一样
                        options: {                   //需要的参数，放入需要依赖的厂商前缀插件
                            plugins: [autoprefixer]
                        }
                    },
                ]
            },
            {   //file-loader
                test: /\.(eot|ttf|svg|woff|woff2)$/, //字体文件用file-loader
                use: {
                    loader:'file-loader',            //只需要使用file转移到输出目录即可
                    options:{
                        outputPath:'font/'          //打包放入font文件夹
                    }
                }
            },
            {   //stylus-loader
                test: /\.styl$/,                     //stylus文件编译成普通css文件(npm i stylus stylus-loader --save)
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,     //一般我们都单独抽离css文件
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,       //这个配置为了防止在stylus文件中嵌套的使用@import引入新的文件，不会再走下面的stylus-loader等两个loader环节引发的问题
                            // modules: true        //使用模块化css，使用之后需要通过import style from 'xxx';img.calssList.add(style.avatar)这样的方式针对局部使用该样式文件；目的是不影响全局样式，鸡肋！
                        }
                    },
                    'postcss-loader',                //这种写法需要另建postcss.config.js文件来配置，不如上方直接在options中配置
                    'stylus-loader'                  //注意顺序，postcss-loader在前，先要解析stylus，再加厂商前缀    npm i stylus stylus-loader --save   
                ]
            },
            {   //sass-loader
                test: /\.scss$/,                    //scss编译，同理stylus！
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,     
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,       
                        }
                    },
                    'postcss-loader',          
                    'sass-loader'                  
                ]
            },
            {   //url-loader   内置了file-loader，当超过limit规定的大小，则使用file-loader，会将匹配的文件复制到规定的imgs目录
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'imgs/',                //图片的输出地址，相对于output.path的地址（也就是输出文件夹下创建一个imgs文件夹存放图片）
                        publicPath: '../imgs/',             //引用该文件的路径。（打包后去哪找图片！）
                        limit: 8 * 1024,                    //限制文件的大小 8k
                        name: '[name]_[hash].[ext]'         //打包后的命名规则
                    }
                }
            },
            {    //bable 
                test: /\.m?js$/,                             //对js进行语法降级，chrome等浏览器可以直接识别es6，但很多低版本以及ie不能            
                exclude: /(node_modules|bower_components)/,  //配置需要排除降级的文件夹，如node_modules等，不需要给第三方依赖做语法转译
                use: {
                    loader: 'babel-loader',                  //使用babel-loader，但是它只是一个桥梁，真正进行语法编译降级的是下面的@babel/preset-env  （npm install --save-dev babel-loader @babel/core）
                    // 这里把options注释是因为建立了一个.babelrc文件在根目录，可以自动实用其中的配置，在babelrc文件中我配置使用了第一套配置，可以打开查看详情；

                    // options: {
                    //     // 两套配置，总结来讲业务代码推荐用第一种套餐搭配，写一些插件以及类库为了防止变量污染则建议使用下面的runtime的plugin！
                    //     presets: [
                    //         [
                    //             '@babel/preset-env', {         //使用preset-env进行语法降级（另外还需要配合@babel/polyfill（在index.js中使用）进行低版本浏览器不存在的一些特性弥补才能真正实现全部语法兼容）   npm install @babel/preset-env --save-dev
                    //                 useBuiltIns: 'usage',                 //import "@babel/polyfill"进行特性弥补时会弥补所有的高级语法，通过usage配置，则只会弥补代码中有使用到的需要弥补的语法特性，从而减少打包后的文件体积，另外配置了该项后会帮我们自动引入babel/polyfill，无需再在业务代码中手动引入；
                    //                 // targets:{                          //通过浏览器版本进行语法过滤，一般来讲你不知道用户会使用什么浏览器的情况，就注释掉吧！
                    //                 //     chrome:'67'                    //这里用于配置你的代码所使用的的浏览器环境，让webpack自动的根据浏览器支持情况进行决定是否有必要进行代码降级等！在当前配置的浏览器版本支持对应语法的情况下不需要再进行降级，弥补等操作，达到节省性能以及减少代码体积的效果；
                    //                 // }
                    //             }
                    //         ],
                    //         // "@babel/preset-react"              //preser-react解析react代码；当然这里并没有使用到react；
                    //     ],

                    //     // 写插件、类库等推荐该方法，有效防止变量污染；上面的搭配套餐中的polyfill会存在变量污染的问题；
                    //     // "plugins": [["@babel/plugin-transform-runtime", {    //  npm install --save @babel/runtime
                    //     //     "corejs": 2,                                     //这里改成2需要额外增加一个包  npm install --save @babel/runtime-corejs2
                    //     //     "helpers": true,
                    //     //     "regenerator": true,
                    //     //     "useESModules": false
                    //     // }]]
                    // }
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
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[hash].css',          //除了给css命名，还可以增加路径（这里给css创建一个单独的css文件夹）
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync([
                path.join(__dirname, './*.html'),       //匹配html文件
                path.join(__dirname, './src/js/*.js')   //匹配js文件
            ]),
        }),
        new HtmlWebpackPlugin({                         //用于自动在dist生成html，  （npm i html-webpack-plugin -D）
            filename: 'html/home.html',                     //天坑，这里在run dev时不能使用html/home.html    打包的时候可以按照自定义来打包。但是跑服务器不能加层级也不能改名字;
            template: './index.html',                   //模板html，会往模板html注入js
            minify: {
                removeComments: true,                    //去掉注释    可以自己改
                collapseWhitespace: true,                //去掉空格   压缩html
            }
        }),
        new WebpackDeepScopeAnalysisPlugin(),
        new CleanWebpackPlugin(),                       //用于在重新打包时删除原有代码（主要解决带hash文件没法对应替换的问题）,同时因为开发环境的打包代码在内存中，所以开发环境不用clean也行！
        new Webpack.HotModuleReplacementPlugin(),       //使用HMR技术，用于支持热更新；需要配置hot
        // -->对于css，样式改变不需要刷新页面，自动替换；
        // -->对于js，可以在入口文件中对不同模块进行监听处理；如下代码（index.js）：
        // 总结来讲对css是神器，对js略鸡肋，但事实上css只是css-loader帮我们把下面这种繁琐的事情做了，而js只能手写。而在vue中vue-loader也帮我们做了这种事。不需要手动写callback；
        //  if(module.hot){       //在开启hot的情况下，监听引入的number模块，当模块发生变化，执行callback；
        //      module.hot.accept('./number', () => {
        //         // do something
        //      })
        //  } 
    ],
    
    // 讲了一大堆，结果production模式会自动配置tree shaking，所以这里不用写！但是sideEffects还是要配置！
    // optimization:{                //three Shaking的配置！用于过滤掉我们引入了文件，但并没有使用到该文件中export出来的其他未使用模块。对这部分模块我们过滤掉，按需使用节省性能和打包后的代码体积！
    //     usedExports:true          //首先他只支持ES模块规范，因为他是静态的（import），不支持commonJs规范（require）！另外需要在package.json中的sideEffects对某些文件做特殊处理，详情见webpack.md！
    // },                            //值得注意的是production环境才会生效，development环境因为考虑到过滤掉以后不便于调试找到准确的行数，所以开发模式并没有tree shaking处理；

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




