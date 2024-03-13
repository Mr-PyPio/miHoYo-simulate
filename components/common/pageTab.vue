<template>
	<view class="pageTab">
		<view :class="{'active' : pageType === 1}" class="pageTabItem" @tap="toUrl(1)">
			<image :src="indexImage" mode="widthFix" class="itemIcon"></image>
			<view class="">
				首页
			</view>
		</view>
		<view :class="{'active' : pageType === 2}" class="pageTabItem" @tap="toUrl(2)">
			<image :src="trendsImage" mode="widthFix" class="itemIcon"></image>
			<view class="">
				动态
			</view>
		</view>
		<view :class="{'active' : pageType === 3}" class="pageTabItem" @tap="toUrl(3)">
			<image :src="messageImage" mode="widthFix" class="itemIcon"></image>
			<view class="">
				消息
			</view>
		</view>
		<view :class="{'active' : pageType === 4}" class="pageTabItem" @tap="toUrl(4)">
			<image :src="selfImage" mode="widthFix" class="itemIcon"></image>
			<view class="">
				我的
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapState(['pageType']),
			indexImage() {
				let url = "../../static/index.png"
				if(this.pageType === 1) {
					url =  "../../static/index-sel.png"
				}
				return url
			},
			trendsImage() {
				let url = "../../static/trends.png"
				if(this.pageType === 2) {
					url =  "../../static/trends_sel.png"
				}
				return url
			},
			messageImage() {
				let url = "../../static/message.png"
				if(this.pageType === 3) {
					url =  "../../static/message-sel.png"
				}
				return url
			},
			selfImage() {
				let url = "../../static/self.png"
				if(this.pageType === 4) {
					url =  "../../static/self-sel.png"
				}
				return url
			},
			
		},
		methods: {
			...mapMutations(['updatePageType']),
			toUrl(type) {
				uni.navigateTo({
					url: 	this.resetPageType(type)
				})
			},
			resetPageType(type) {
				this.updatePageType(type)
				// this.pageType = type
				let url
				if(type === 1) {
					url = "/pages/index/index"
				}
				if(type === 2) {
					url = "/pages/action/action"
				}
				if(type === 3) {
					url = "/pages/message/message"
				}
				if(type === 4) {
					url = "/pages/self/self"
				}
				return url
			},
			initPageType(router) {
				const arr = router.split('/')
				const route = arr[arr.length -1] 
				let type = 1
				if(route == 'self') {
					type = 4
				}
				if(route == 'message') {
					type = 3
				}
				if(route == 'action') {
					type = 2
				}
				this.resetPageType(type)
			}
		},
		created() {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			const router = page.route
			console.log(router)
			this.initPageType(router)
		}
	}
</script>

<style lang="scss" scoped>
	.pageTab{
		display: flex;
		height: 100rpx;
		width: 750rpx;
		background: #f8f8f8;
		color: #808489;
		font-size: 24rpx;
		text-align: center;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1;
		box-sizing: border-box;
		padding-top: 8rpx;
		
		// #ifdef MP-WEIXIN
		height: 130rpx;
		padding-bottom: 30rpx;
		// #endif
		
		.pageTabItem{
			padding: 0 30rpx;
			&.active{
				color: #4ca0f7;
			}
			
			.itemIcon{
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
</style>