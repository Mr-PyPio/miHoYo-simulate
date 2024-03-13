import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {emotionApi,emotionKeywordsApi} from "../common/api.js"

export default new Vuex.Store({
	state: {
		videoMute: false,
		pageType: 1,
		
		imgFixWrappShow: false,
		imgList: [],
		imgShowIndex: 0,
		
		myselfData: {},
		myselfUid: '19084220',
		limitTime: Date.now(),
		
		actionPage: {}
	},
	mutations: {
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
})