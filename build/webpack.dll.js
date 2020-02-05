const path = require("path")

module.exports = {
    mode:"production",
    entry:{
        vendors:['lodash','jquery']     //把公共的库单独打包一次，不用每次都去打包公共库，以节省打包效率；
    },
    output:{
        filename:'[name].dll.js',      
        library:'[name]',              //将打包的库用他的名字作为变量名暴露出去供使用，也就是vendors；不能再用$()
        path: path.resolve(__dirname, '../dll'),         //打包的公共库放到一个单独的文件夹中
    }
}
