关于webpack的一些原生命令，会在这个md文件中提及；

webpack --config weboackconfig.js     //表示规定以指定配置文件进行配置打包，如下start；
webpack-dev-server --open             //开启热更新服务器，并自动打开浏览器，如下dev；
webpack --watch                       //打包并监听，当代码发生改变，自动重新打包；如下watch

<!-- 如下在package.json中配置scripts，相当于快捷命令，使用npm run xxx即可执行 -->
  "scripts": {
    "bundle": "webpack",
    "watch": "webpack --watch", 
    "start":"webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open"
  },



