<template>
	<view class="" :style="{'height': '100%'}" >
		<scroll-view :scroll-y="true" :style="{'height': '100%'}"  @scrolltolower="scrollBottom">
			<view v-if="postData" class="topicList">
				<view v-for="(item,index) in postData" :key="index">
					<topic-items :item="item" :keyWord="keyWord"></topic-items>
				</view>
				<view class="loading2" v-if="!is_last">
					<u-loading-icon mode="circle" size="42"></u-loading-icon>
				</view>
				<view class="reviewEnd" v-if="is_last">
					<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix"  class="image"></image>
				</view>
			</view>
		</scroll-view>
		<image src="../../static/search/loading1.gif" mode="widthFix" class="loading" v-if="loading"></image>
	</view>
</template>

<script>
	import {searchTopic} from "../../common/api.js"
	import TopicItems from "./topicItems.vue"
	export default {
		name: 'topicPost',
		components: {
			TopicItems
		},
		data() {
			return {
				loading: false,
				keyWord: '',
				last_id: 0,
				is_last: false,
				postData: null,
				upDateLoading: false,
			}
		},
		methods: {
			async initData(keyWord) {
				this.loading = true
				this.keyWord = keyWord
				const {data: res} = await searchTopic(this.keyWord)
				const dataNew = res.data
				this.last_id = dataNew.last_id
				this.is_last = dataNew.is_last
				this.postData = dataNew.topics
				let timer = setTimeout(() => {
					this.loading = false
					clearTimeout(timer)
				},300)
			},
			async scrollBottom() {
				if(!this.upDateLoading && !this.is_last) {
					this.upDateLoading = true
					const {data: res} = await searchTopic(this.keyWord,this.last_id)
					const dataNew = res.data
					this.last_id = dataNew.last_id
					this.is_last = dataNew.is_last
					this.postData.push(...dataNew.topics)
					this.upDateLoading = false
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	
	.loading{
		width: 400rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	
	.topicList{
		padding: 24rpx;
	}
	
	.reviewEnd{
		padding: 15px 0 30px;
		
		.image{
			width: 450rpx;
			margin: 0 auto;
			display: block;
		}
	}
	
	.loading2{
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
	}
</style>