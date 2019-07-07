关于package.json的一些内容，如原生命令等，会在这个md文件中提及；

webpack --config webpack.prod.js      //表示规定以指定配置文件进行配置打包，这里规定生产环境的配置文件，如下build；
另外：build命令中的 --profile --json > stats.json   //代表把打包状态的描述信息输出到stats.json这样一个json文件中，也可以使用BundleAnalyzerPlugin插件实现 --> 见common.js中BundleAnalyzerPlugin插件配置
webpack-dev-server --open             //开启热更新服务器，并自动打开浏览器且使用开发模式的配置文件，如下dev；
webpack --watch                       //打包并监听，当代码发生改变，自动重新打包；如下watch

<!-- 如下在package.json中配置scripts，相当于快捷命令，使用npm run xxx即可执行 -->
  "scripts": {
    "bundle": "webpack",
    "watch": "webpack --watch",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --profile --json > stats.json --config webpack.prod.js",
    "dev-build": "webpack --config ./build/webpack.dev.js",                //这个用来解决开发模式文件在内存中看不到的问题，此时相当于用dev模式打包出代码；
    "middleware": "node server.js"
  },


  "sideEffects":["*.css","*.styl"]  -->  是一个tree shaking的配置，防止在tree shaking的时候发现一些引入的模块在没有导出任何东西的时候，而把这些模块忽略打包，如：babel-polyfill（它这时把一些方法挂载在window，没有export），css等包，他们本质上没有导出任何内容，但是却是我们所需要的模块，这时我们需要将它们放入配置中，以使得tree shaking能够忽略去用规则处理他们，正常的引入即可；

