<template>
	<view class="" :style="{'height': scrollHeight}">
		<scroll-view :scroll-y="true" :style="{'height': scrollHeight}" @scrolltolower="scrollBottom">
			<view v-if="postData" class="userList">
				<view v-for="(item,index) in postData" :key="index">
					<user-items :item="item" :keyWord="keyWord"></user-items>
				</view>
				<view class="loading2" v-if="!is_last">
					<u-loading-icon mode="circle" size="42"></u-loading-icon>
				</view>
				<view class="reviewEnd" v-if="is_last">
					<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix"  class="image"></image>
				</view>
			</view>
		</scroll-view>
		<image src="../../static/search/loading1.gif" mode="aspectFit" class="loading" v-if="loading"></image>
	</view>
</template>

<script>
	import {searchUser} from "../../common/api.js"
	import UserItems from "./userItems.vue"
	export default {
		name: 'userPost',
		components: {
			UserItems
		},
		data() {
			return {
				loading: false,
				scrollHeight: 0,
				last_id: null,
				is_last: false,
				keyWord: '',
				postData: null,
				upDateLoading: false
			}
		},
		created() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight * rpxNum
					this.windowWidth = res.windowWidth * rpxNum
					this.scrollHeight = this.windowHeight - 178 + 'rpx'
				}
			})
		},
		methods: {
			async initData(keyWord) {
				this.loading = true
				this.keyWord = keyWord
				const {data: res} = await searchUser(this.keyWord)
				const dataNew = res.data
				this.last_id = dataNew.last_id
				this.is_last = dataNew.is_last
				this.postData = dataNew.users
				setTimeout(() => {
					this.loading = false
				},300)
			},
			async scrollBottom() {
				if(!this.upDateLoading && !this.is_last) {
					this.upDateLoading = true
					const {data: res} = await searchUser(this.keyWord,this.last_id)
					const dataNew = res.data
					this.last_id = dataNew.last_id
					this.is_last = dataNew.is_last
					this.postData.push(...dataNew.users)
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
	
	.userList{
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