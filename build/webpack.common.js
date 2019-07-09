const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const Webpack = require('webpack');       //这里是为了使用providePlugin插件
const glob = require('glob-all')                       //配合PurifyCSSPlugin消除未使用的css。
const path = require("path")
const merge = require('webpack-merge')

// 这里的公共配置，用npm i webpack-merge -D 分别合并到dev跟pro两个模式，达到代码复用
const prodConfig = require('./webpack.prod.js');
const devConfig = require('./webpack.dev.js');

const commonConfig = {
    entry: {
        index: path.join(__dirname, '../src/js/index.js'),      //也可以写多个入口，html引入多个打包后的js；
    },
    output: {
        // publicPath:'http://cdn.com.cn',                  //当js在另一个cdn地址上，这里将作为html引用js地址中拼接成最终的完整访问地址；如：<script src="http://cdn.com.cn/js/index.boundle.js"></script>;
        path: path.resolve(__dirname, '../dist'),           //dirname代表当前配置文件所在的目录，也就是根目录，在此根目录下创建子文件夹dist为打包后的文件路径；
        filename: "js/[name]_[contenthash].boundle.js",     //除了命名，可以在前面加路径名，创建文件夹，增加相对打包出来的dist的路径；
        chunkFilename:'js/[name]_[contenthash].chunk.js'    //其实就是splitChunks中的配置；配置其中之一即可；
    },
    module: {
        rules: [                                     //众所周知use中的loader是倒着用的，所以顺序一定要注意；
            {   //file-loader
                test: /\.(eot|ttf|svg|woff|woff2)$/, //字体文件用file-loader
                use: {
                    loader: 'file-loader',           //只需要使用file转移到输出目录即可
                    options: {
                        outputPath: 'font/'          //打包放入font文件夹
                    }
                }
            },
            {   //sass-loader
                test: /\.scss$/,                     //scss编译，同理stylus！
                use: [
                    'style-loader',
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
            {    //bable 
                test: /\.m?js$/,                             //对js进行语法降级，chrome等浏览器可以直接识别es6，但很多低版本以及ie不能            
                exclude: /(node_modules|bower_components)/,  //配置需要排除降级的文件夹，如node_modules等，不需要给第三方依赖做语法转译
                use: [{
                    loader: 'babel-loader',                  //使用babel-loader，但是它只是一个桥梁，真正进行语法编译降级的是下面的@babel/preset-env  （npm install --save-dev babel-loader @babel/core）
                    // 这里把options注释是因为建立了一个.babelrc文件在根目录，可以自动实用其中的配置，在babelrc文件中我配置使用了第一套配置，可以打开查看详情；

                    // options: {
                    //     // 两套配置，总结来讲业务代码推荐用第一种套餐搭配，写一些插件以及类库为了防止变量污染则建议使用下面的runtime的plugin！
                    //     presets: [
                    //         [
                    //             '@babel/preset-env', {     //使用preset-env进行语法降级（另外还需要配合@babel/polyfill（在index.js中使用）进行低版本浏览器不存在的一些特性弥补才能真正实现全部语法兼容）   npm install @babel/preset-env --save-dev
                    //                 useBuiltIns: 'usage',  //import "@babel/polyfill"进行特性弥补时会弥补所有的高级语法，通过usage配置，则只会弥补代码中有使用到的需要弥补的语法特性，从而减少打包后的文件体积，另外配置了该项后会帮我们自动引入babel/polyfill，无需再在业务代码中手动引入；
                    //                 // targets:{           //通过浏览器版本进行语法过滤，一般来讲你不知道用户会使用什么浏览器的情况，就注释掉吧！
                    //                 //     chrome:'67'     //这里用于配置你的代码所使用的的浏览器环境，让webpack自动的根据浏览器支持情况进行决定是否有必要进行代码降级等！在当前配置的浏览器版本支持对应语法的情况下不需要再进行降级，弥补等操作，达到节省性能以及减少代码体积的效果；
                    //                 // }
                    //             }
                    //         ],
                    //         // "@babel/preset-react"       //preser-react解析react代码；当然这里并没有使用到react；
                    //     ],

                    //     // 写插件、类库等推荐该方法，有效防止变量污染；上面的搭配套餐中的polyfill会存在变量污染的问题；
                    //     // "plugins": [["@babel/plugin-transform-runtime", {    //  npm install --save @babel/runtime
                    //     //     "corejs": 2,                                     //这里改成2版本需要额外增加一个包  npm install --save @babel/runtime-corejs2
                    //     //     "helpers": true,
                    //     //     "regenerator": true,
                    //     //     "useESModules": false
                    //     // }]]
                    // }
                },{
                    // loader:'imports-loader?this=>window'      //默认来讲所有的依赖包内的this指向自身，通过这个插件方法可以指向window;有特殊需要才用吧！
                }]
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
        new WebpackDeepScopeAnalysisPlugin(),
        new PurifyCSSPlugin({                           //（坑）用于抽离多余的css，所以这里匹配的html跟js所有用到css的入口千万不能错，否则检测没用上就都不见了；
            paths: glob.sync([
                path.join(__dirname, '../*.html'),      //匹配html中使用到的css
                path.join(__dirname, '../src/js/*.js')  //匹配js中使用到的css
            ]),
        }),  
        // new Webpack.ProvidePlugin({        //用于解决模块之间不能相互引用的问题，以满足两个封闭的依赖包可以相互引用，帮助其import指定模块；
        //     $:'jquery'                     //检测到使用$则自动帮助import $ form 'jquery'
        // })
    ],
    
    optimization:{
        // runtimeChunk:{
        //     name:'runtime'  //把依赖的关系放到一个单独的文件中，防止webpack老版本混在业务代码中时因为依赖关系改变而导致contenthash改变；
        // },
        usedExports:true,   //tree shaking！以下讲了一大堆，结果production模式会自动配置tree shaking，所以这里不用写！但是package.json中的sideEffects还是要配置！
                            //three Shaking！用于过滤掉我们引入了文件，但并没有使用到该文件中export出来的其他未使用模块。对这部分模块我们过滤掉，按需使用节省性能和打包后的代码体积！
                            //首先他只支持ES模块规范，因为他是静态的（import），不支持commonJs规范（require）！另外需要在package.json中的sideEffects对某些文件做特殊处理，详情见webpack.md！
                            //值得注意的是production环境才会生效，development环境因为考虑到过滤掉以后不便于调试找到准确的行数，所以开发模式并没有tree shaking处理；                 

        //启用代码分割，比如引入的lodash，不应该跟业务代码打包到一起，以便于用户第二次访问页面，依赖文件没变而可以直接取缓存，而只需要请求变更后的业务代码即可；会自动分割成多个js文件（比手动配置多入口进行分割来的方便）  --> 底部有第二种异步引入方法；
        //关于代码分割还有两个重要的概念：Preloadin,prefetching（推荐）；（webpack认为利用缓存优化第二次访问不是最好的，而是希望优化代码利用率 --> 控制台ctrl + shift + p键打开，点击圆点查看）
        // webpack希望首先加载需要用到的代码，而不需要用到的等页面首先需要的加载完，此时带宽空闲时再去加载其他异步的代码，比如click事件的代码（webpack认为click事件中的代码一开始不需要用到）
        // 使用方式如下：（实际上也就是lazy load导致响应慢的一种解决方案方案）
        // import(/* webpackPrefetch: true */'LoginModal');       //这样会在加载完主要内容带宽空闲时就去加载，用户点击再去下载就直接取缓存了，而普通的import的懒加载会等用户点击再下载那样点击后反应会很慢；
        // import(/* webpackPreload: true */'ChartingLibrary');   //load不如profetch
        splitChunks:{                      //其实下面大部分是默认配置，大部分时候只要配置chunks为all就行
            chunks: 'all',                 //all是对同步跟异步两种分割方式都配置生效
            minSize: 30000,                //当小于30kb时不额外分割打包
            maxSize: 0,                    //打包后超过额定大小尝试二次分割成更小的包，一般不用
            minChunks: 1,                  //当被引用超过1次就打包（这里的次数实际是指打包后的所有chunk分割的包中，有多少个包引入使用过）
            maxAsyncRequests: 5,           //代码分割太厉害会产生多个请求，指最多分割前五个包，之后的将不再分割
            maxInitialRequests: 3,         //入口文件加载超过3个不再分割
            automaticNameDelimiter: '~',   //文件名连接符(默认是[组名]~[入口js文件名].js,filename会覆盖默认名字)
            name: true,                    //使得cacheGroups中的filename生效
            
            //当满足上述条件（比如misize> 30kb），则开始进行下面的缓存组挑选，选择匹配的组来分割；
            cacheGroups: {                            //缓存组，满足同样要求的会打包在一个组js文件中，比如lodash跟jq他们俩会打包在同一个文件中。前提是满足同一个组的要求
                vendors: {                            //组的名字，配置该组的要求
                    test: /[\\/]node_modules[\\/]/,   //匹配的包来自node_modules中,而不是这里的将走default配置
                    priority: -10,                    //优先级，同样满足不同组的要求，数值大小决定优先级
                    name:'vendors',                   
                    // filename:'./js/vendors.[contenthash].js'        //代码分割出来的文件名
                },
                default: {
                    minChunks: 2,                 //被依赖的包，被入口文件引入的次数大于这个数值，才会被打包，如不写，则只有在被所有入口文件都依赖时，才会提取出来分割，否则7个入口，6个依赖，也不会打包，6个文件都有重复代码；
                    priority: -20,
                    reuseExistingChunk: true,     //当一个包已经被分割过，将直接使用之前的
                    name:'common',
                    // filename:'./js/common.[contenthash].js'
                },
            }
        }
    },
}

module.exports = (env) => {    //由全局变量控制对应配置来打包，跟单纯的merge有所区别，主要了解这种全局变量配置的方式；
    if(env && env.production){
        return merge(commonConfig, prodConfig);
    }else{
        return merge(commonConfig, devConfig)
    }
}

// (下面的代码不应该出现在这，但是为了笔记方便查阅。没管那么多了)
// 如下，这种异步加载模块的方法（懒加载，在点击之前不会加载loadsh），不需要配置splitChunks也可以自动进行代码分割，但是配置还是会走上述配置(需要babel的一个插件来转译实验性语法'npm i @babel/plugin-syntax-dynamic-import --save-dev'  --> .babelrc配置  -->   "plugins": ["@babel/plugin-syntax-dynamic-import"] )
    //  -->  index.js
// function getComponent(){    
//     return import(/* webpackChunkName:"lodash" */ 'lodash').then(({default: _ }) => {    // /* webpackChunkName:"lodash" */用来给chunk后的包起指定名字（需要依赖上述@babel/plugin-syntax-dynamic-import包才能识别这种注释一样的语法）
//         var element = document.createElement('div');
//         element.innerHTML = _.join(['xiao','shang','shang'],"-");
//         return element;
//     })
// } 
// // 这种异步写法可以避免使用promise，更简洁！
// async function getComponent(){    
//     const { default: _ } = await import(/* webpackChunkName:"lodash" */ 'lodash')
//     const element = document.createElement('div');
//     element.innerHTML = _.join(['xiao','shang','shang'],"-");
//     return element;
// }
// //另外这种异步引入模块还有一个特别的好处就是懒加载模块，比如这里在点击之前不会下载loadsh库；
// document.addEventListener('click', () => {   
//     getComponent().then(element => {
//         document.body.appendChild(element);
//     })
// })


/**
 * 如下为打包信息详细分析方式与技巧；
 *  在build命令中加入：-profile --json > stats.json 来生成打包详细信息json文件 --> 如下：
 * "build": "webpack --profile --json > stats.json --config ./build/webpack.prod.js",
 * 打开网站  webpack.github.io/analyse/  或者  https://alexkuz.github.io/webpack-chart/  (需要翻墙)
 * 另外webpack官方也有推荐工具，detail see https://www.webpackjs.com/guides/code-splitting/#bundle-%E5%88%86%E6%9E%90-bundle-analysis-
 * 这里推荐用插件 npm install --save-dev webpack-bundle-analyzer
 * 详情见 webpack.prod.js 配置
 * --profile --json > stats.json
 */

