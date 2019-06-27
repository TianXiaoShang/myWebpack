const PurifyCSSPlugin = require('purifycss-webpack')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const glob = require('glob-all')
const path = require("path")
// 这里的公共配置，用npm i webpack-merge -D 分别合并到dev跟pro两个模式，达到代码复用

module.exports = {
    entry: {
        index: path.join(__dirname, '../src/js/index.js'),                  //也可以写多个入口，html引入多个打包后的js；
    },
    output: {
        // publicPath:'http://cdn.com.cn',          //当js在另一个cdn地址上，这里将作为html引用js地址中拼接成最终的完整访问地址；如：<script src="http://cdn.com.cn/js/index.boundle.js"></script>;
        path: path.resolve(__dirname, '../dist'),      //dirname代表当前配置文件所在的目录，也就是根目录，在此根目录下创建子文件夹dist为打包后的文件路径；
        filename: "js/[name]_[hash].boundle.js"     //除了命名，可以在前面加路径名，创建文件夹，增加相对打包出来的dist的路径；
    },
    module: {
        rules: [                                     //众所周知use中的loader是倒着用的，所以顺序一定要注意；
            {   //file-loader
                test: /\.(eot|ttf|svg|woff|woff2)$/, //字体文件用file-loader
                use: {
                    loader: 'file-loader',            //只需要使用file转移到输出目录即可
                    options: {
                        outputPath: 'font/'           //打包放入font文件夹
                    }
                }
            },
            {   //stylus-loader
                test: /\.styl$/,                     //stylus文件编译成普通css文件(npm i stylus stylus-loader --save)
                use: [
                    'style-loader',
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
            {   //sass-loader
                test: /\.scss$/,                    //scss编译，同理stylus！
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
            {   //url-loader   内置了file-loader，当超过limit规定的大小，则使用file-loader，会将匹配的文件复制到规定的imgs目录
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'imgs/',                //图片的输出地址，相对于output.path的地址（也就是输出文件夹下创建一个imgs文件夹存放图片）
                        publicPath: '../imgs/',             //引用该文件的路径。
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
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync([
                path.join(__dirname, './*.html'),       //匹配html文件
                path.join(__dirname, './src/js/*.js')   //匹配js文件
            ]),
        }),
        new WebpackDeepScopeAnalysisPlugin(),
    ],
}