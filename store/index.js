import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {emotionApi,emotionKeywordsApi} from "@/common/api.js"

export default new Vuex.Store({
	state: {
		videoMute: false,
		pageType: 1,
		
		windowHeight: 0,
		rpxNum: 0,
		windowWidth: 0,
		
		imgFixWrappShow: false,
		imgList: [],
		imgShowIndex: 0,
		
		myselfData: {},
		myselfUid: '19084220',
		limitTime: Date.now(),
		
		actionPage: {},
		
		emotion: null,
		emotionKey: null
	},
	mutations: {
		updateEmotion(state,data) {
			state.emotion = data
		},
		updateEmotionKey(state,data) {
			state.emotionKey = data
		},
		updateWindowHeight(state,data) {
			if(data.height) state.windowHeight = data.height
			if(data.rpxNum) state.rpxNum = data.rpxNum
			if(data.windowWidth) state.windowWidth = data.windowWidth
		},
		updateVideoMute(state,type) {
			state.videoMute = type
		},
		updatePageType(state, type) {
			state.pageType = type
		},
		updateImageData(state,data) {
			state.imgFixWrappShow = data.show
			state.imgShowIndex = data.showIndex
			state.imgList = data.list
		},
		updateImgShowIndex(state, index) {
			state.imgShowIndex = index
		},
		updateMyselfData(state,data) {
			state.myselfData[data.name] = data.data
		},
		clearMyselfState(state,data) {
			state.myselfData = {}
		},
		updateActionPage(state,data) {
			state.actionPage[data.name] = data.data
		},
		clearActionPageState(state,data) {
			state.actionPage = {}
		},
	},
	actions: {
		async initEmotionData({ commit }) {
			const emotion = uni.getStorageSync('emotion')
			const emotionKey = uni.getStorageSync('emotionKey')
			if(emotion) {
				commit('updateEmotion', emotion);
			}else{
				const {data: res} = await emotionApi()
				uni.setStorageSync('emotion',res.data)
				commit('updateEmotion', res.data);
			}
			if(emotionKey) {
				commit('updateEmotionKey', emotionKey);
			}else{
				const {data: res} = await emotionKeywordsApi()
				uni.setStorageSync('emotionKey',res.data)
				commit('updateEmotionKey', res.data);
			}
		},
	}
})