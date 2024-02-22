// // vue.config.js
// module.exports = {
// 	devServer: {
// 	  proxy: {
// 		'/api': {
// 		  target: 'http://127.0.0.1:3307',   //node.js服务器运行的地址
// 		  ws: true,
// 		  changeOrigin: true,
// 		  pathRewrite: {
// 			'^/api': 'http://192.168.0.102:8086'  //路径重写
// 		  }
// 		},
// 	  }
// 	},
// }
// const path = require('path');

 module.exports = {
    transpileDependencies: ['@climblee/uv-ui']
 }