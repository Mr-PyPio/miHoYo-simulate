import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {emotionApi,emotionKeywordsApi} from "../common/api.js"

export default new Vuex.Store({
	state: {
		videoMute: false,
		
		
	},
	mutations: {
		updateVideoMute(state,type) {
			state.videoMute = type
		},
	},
})