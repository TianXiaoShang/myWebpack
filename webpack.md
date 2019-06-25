webpack --config weboackconfig.js     //表示规定以指定配置文件进行配置打包

<!-- 如下在package.json中配置scripts，相当于快捷命令，使用npm run xxx即可执行 -->
  "scripts": {
    "bundle": "webpack",
    "start":"webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open"
  },