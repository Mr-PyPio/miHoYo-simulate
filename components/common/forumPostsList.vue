<template>
	<view class="item" @tap.stop="navigatePostReplay(item.post.post_id)">
		<view :class="'itemImage'+item.cover.entity_id" style="height: 1px;"></view>
		<view class="itemImage" ref="itemImage" :style="{'width': imageWidth + 'rpx','height': imageHeight + 'rpx'}">
			<!-- <image :src="item.cover.url|imageUrlReset(220,80)" :lazy-load="true" mode="widthFix" v-if="loading"></image>
			<image src="../../static/loadingImg.png" mode="widthFix" class="loadingImg" v-if="!loading"></image> -->
			<LazyImage :imageData="item.cover" ></LazyImage>
			
			<view class="moreImage" v-if="item.image_list.length > 2">
				+{{item.image_list.length}}
			</view>
			
			<view v-if="is_video">
				<view class="videoStep" v-if="item.vod_list[0].resolutions">
					{{item.vod_list[0].resolutions[0].bitrate|resetVideoStep}}
				</view>
			</view>
			
			<view v-if="is_video" class="videoStepWrapp"></view>
		</view>
		<view class="itemText">
			{{item.post.subject}}
		</view>
		<view class="itemUser">
			<view class="wrapLeft" @tap.stop="navigateToUser(item.user.uid)">
				<image :src="item.user.avatar_url" mode="aspectFill" ></image>
				<text class="userName">{{item.user.nickname}}</text>
			</view>
			<view class="wrapRight">
				<u-icon name="thumb-up" color="#999" size="40"></u-icon>
				{{item.stat.like_num}}
			</view>
		</view>
	</view>
</template>

<script>
	import LazyImage from '@/components/common/lazyImage.vue'
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		components: {
			LazyImage
		},
		data() {
			return {
				loading: false,
				imageWidth: 340,
				imageHeight: 0,
				entity_id: this.item.cover.entity_id,
				is_video: this.item.vod_list.length ? true: false
			}
		},
		created() {
			this.resetWH()
		},
		methods: {
			resetWH() {
				const cover = this.item.cover
				const width = cover.width
				const height = cover.height
				const num = parseInt(340 * height / width)
				if(num > 600) {
					this.imageHeight = 600
				}else{
					this.imageHeight = num
				}
			},
			navigatePostReplay(post_id) {
				if(this.is_video) {
					uni.navigateTo({
						url: `/subPackages/postReplay/postReplay?post_id=${post_id}`,
					})
				}else{
					uni.navigateTo({
						url: `/subPackages/artical/artical?post_id=${post_id}`,
					})
				}
			},
			navigateToUser(uid) {
				uni.navigateTo({
					url: `/subPackages/user/user?uid=${uid}`,
				})
			}
		},
		mounted() {
			this.intersectionObserver = uni.createIntersectionObserver(this);
			this.intersectionObserver.relativeToViewport({bottom: -500}).observe(`.itemImage${this.entity_id}`, (res) => {
			  if (res.intersectionRatio > 0) {
				this.loading = true
				this.intersectionObserver.disconnect()
			  } 
			});
		},
		filters: {
			resetVideoStep(time) {
				if(time >= 60000) {
					const M = parseInt(time / 60000) >= 10 ? parseInt(time / 60000): '0'+ parseInt(time / 60000)
					const S = parseInt(time % 60000 / 1000) >= 10 ? parseInt(time % 60000 / 1000): '0' + parseInt(time % 60000 / 1000)
					return `${M}:${S}`
				}else{
					const S = parseInt(time / 1000) >= 10 ? parseInt(time / 1000): '0' + parseInt(time / 1000)
					return  `00:${S}`
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.itemImage{
		width: 100%;
		max-height: 600rpx;
		overflow: hidden;
		position: relative;
		background: #f6f6f6;
		
		image{
			width: 100%;
			height: auto;
		}
		
		.loadingImg{
			width: 300rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
		
		.moreImage{
			position: absolute;
			padding: 2px 4px 2px 18px;
			background-image: url("../../static/imgCopy2.png");
			background-color: rgba(0, 0, 0, 0.5);
			background-size: 10px auto;
			background-position: 5px center;
			background-repeat: no-repeat;
			bottom: 6px;
			right: 6px;
			color: #fff;
			font-size: 20rpx;
			border-radius: 4px;
		}
		
		.videoStep{
			position: absolute;
			right: 8rpx;
			bottom: 8rpx;
			font-size: 20rpx;
			color: #fff;
			padding:2px 5px;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 4px;
		}
		
		.videoStepWrapp{
			position: absolute;
			top: 6px;
			left: 6px;
			width: 20px;
			height: 20px;
			background-image: url("../../static/videoIcon.png");
			background-size: 20px 20px;
		}
	}
	
	.itemText{
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; 
		line-height: 20px;
		max-height: 40px;
		margin: 8px 0;
		font-size: 28rpx;
		color: #404040;
		font-weight: 600;
		padding:0 16rpx;
	}
	
	.itemUser{
		padding:0 16rpx;
		color: #999;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.wrapLeft {
			display: flex;
			align-items: center;
			
			image{
				width: 48rpx;
				height: 48rpx;
				margin-right: 4px;
				border-radius: 48rpx;
			}
			
			.userName{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				max-width: 170rpx;
			}
			
		}
		
		.wrapRight{
			display: flex;
			align-items: center;
			font-size: 20rpx;
			padding-left: 4px;
		}
	}
</style>