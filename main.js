import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store/index.js'
App.mpType = 'app'

import CoverLoadingImage from './components/common/coverLoadingImage.vue'

Vue.component('CoverLoadingImage', CoverLoadingImage);

Vue.mixin({
  filters: {
	  imageUrlReset(url,s,q) {
		const reg = /.gif/g
		const matches = url.match(reg);
		
		if(matches) {
			return url
		}else {
			const urlArr = url.split('?')
			return urlArr[0] + `?x-oss-process=image/resize,s_${s}/quality,q_${q}/auto-orient,0/interlace,1/format,png`
		}
	  },
	  resetNum(num) {
		  if(num >= 10000) {
			  return parseInt(num / 10000) + '万'
		  }else{
			  return num
		  }
	  },
	  resetNum2(num) {
		  if(num >= 10000) {
			  const num1 =  parseInt(num / 1000 % 10) 
			  const num2 = parseInt(num / 10000)
			  if(num1 > 0){
				  return num2 + '.' + num1+ '万'
			  }else{
				  return num2 + '万'
			  }
		  }else{
			  return num
		  }
	  }
  }
})


import uView from 'uview-ui'
Vue.use(uView)
// 如此配置即可
uni.$u.config.unit = 'rpx'
Vue.prototype.$store = store

const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif