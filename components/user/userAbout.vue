<template>
	<view class="information">
		<scroll-view :scroll-x="true" :style="{'height': '124rpx'}" v-if="showCategoryMode">
			<view  class="categoryMode">
				<view class="categoryModeItem">
					<view class="top">
						<image :src="imageBaseUrl + 'user/convert.png'" mode="widthFix" class="logo"></image>
						兑换中心
					</view>
					<view class="bottom">
						2月许愿池开启
					</view>
				</view>
				<view class="categoryModeItem">
					<view class="top">
						<image :src="imageBaseUrl + 'user/write.png'" mode="widthFix" class="logo"></image>
						创作中心
					</view>
					<view class="bottom">
						作品收益管理
					</view>
				</view>
				<view class="categoryModeItem">
					<view class="top">
						<image :src="imageBaseUrl + 'user/stall.png'" mode="widthFix" class="logo"></image>
						创小摊
					</view>
					<view class="bottom">
						同人创作集合店
					</view>
				</view>
				<view class="categoryModeItem">
					<view class="top">
						<image :src="imageBaseUrl + 'user/mi.png'" mode="widthFix" class="logo"></image>
						米游铺
					</view>
					<view class="bottom">
						官方周边店
					</view>
				</view>
				<view class="categoryModeItem">
					<view class="top">
						<image :src="imageBaseUrl + 'user/mib.png'" mode="widthFix" class="logo"></image>
						米游币
					</view>
					<view class="bottom">
						今日可得90
					</view>
				</view>
				<view class="">
					<view class="categoryModeItem">
						<view class="top">
							<image :src="imageBaseUrl + 'user/game.png'" mode="widthFix" class="logo"></image>
							游戏中心
						</view>
						<view class="bottom">
							米哈游游戏下载
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	
		<view class="selfArticle"  :style="{'height' : windowHeight*rpxNum - 150 + 'rpx'}">
			<view class="topTab">
				<view class="tabitem" :class="{'active' : activeIndex === 0}" @tap.stop="tabClick(0)">
					发布
				</view>
				<view class="tabitem" :class="{'active' : activeIndex === 1}" @tap.stop="tabClick(1)">
					评论
				</view>
				<view class="tabitem" :class="{'active' : activeIndex === 2}" @tap.stop="tabClick(2)">
					合集
				</view>
				<view class="tabitem" :class="{'active' : activeIndex === 3}" @tap.stop="tabClick(3)">
					收藏
				</view>
			</view>
			
			<view class="swiperContent">
				<swiper :style="{'height': swiperContentHeight}" 
				:current="activeIndex" @change="swiperChange">
					<swiper-item>
						<user-instant :uid="uid" ></user-instant>
					</swiper-item>
					<swiper-item>
						<user-replay :uid="uid" ></user-replay>
					</swiper-item>
					<swiper-item>
						<user-collection :uid="uid" ></user-collection>
					</swiper-item>
					<swiper-item>
						<user-favourite :uid="uid" ></user-favourite>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserInstantList,getUserFavourite,getUserReply,getUserCollection} from '../../common/api.js'
	import UserInstant from './userInstant.vue'
	import UserReplay from './userReply.vue'
	import UserCollection from './userCollection.vue'
	import UserFavourite from './userFavourite.vue'
	import {mapState} from 'vuex'
	export default {
		name:"userAbout",
		components: {
			UserInstant,
			UserReplay,
			UserCollection,
			UserFavourite
		},
		props: {
			uid: {
				type: String,
				default() {
					return ''
				}
			},
			showCategoryMode: {
				type: Boolean,
				default() {
					return true
				}
			}
		},
		data() {
			return {
				activeIndex: 0
			}
		},
		computed: {
			...mapState(['imageBaseUrl']),
			swiperContentHeight() {
				let height = ''
				// #ifdef MP-WEIXIN
					if(this.showCategoryMode) {
						height = this.windowHeight*this.rpxNum - 270  + 'rpx'
					}else{
						height = this.windowHeight*this.rpxNum - 170 + 'rpx'
					}
				// #endif
				// #ifdef WEB
					if(this.showCategoryMode) {
						height = this.windowHeight*this.rpxNum - 160  + 'rpx'
					}else{
						height = this.windowHeight*this.rpxNum - 50 + 'rpx'
					}
				// #endif
				return height
			}
		},
		methods: {
			tabClick(index) {
				this.activeIndex = index
			},
			swiperChange(e) {
				this.activeIndex = e.detail.current
			}
		},
		created() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.information{
		background: #fff;
		border-top-left-radius: 28rpx;
		border-top-right-radius: 28rpx;
		margin-top: 50rpx;
		width: 750rpx;
		box-sizing: border-box;
		
		.categoryMode{
			display: flex;
			padding-top: 32rpx;
			padding-left: 32rpx;
			box-sizing: border-box;
			
			.categoryModeItem{
				margin-right: 20rpx;
				width: 180rpx;
				padding: 12rpx;
				border-radius: 12rpx;
				box-sizing: border-box;
				background: #f5f7f8;
				
				&:last-of-type{
					margin-right: 32rpx;
				}
				
				.top{
					width: 180rpx;
					font-size: 24rpx;
					display: flex;
					color: #000;
					font-weight: 600;
					align-items: center;
					margin-bottom: 4rpx;
					
					.logo{
						width: 34rpx;
						margin-right: 6rpx;
					}
				}
				
				.bottom{
					font-size: 20rpx;
					color: #b8babc;
				}
			}
		}
	
		.selfArticle{
			padding: 32rpx 0;
			box-sizing: border-box;
			
			.topTab{
				display: flex;
				padding: 0 32rpx;
					
				.tabitem{
					font-size: 30rpx;
					color: #cccfd1;
					margin-right: 46rpx;
					padding-bottom: 20rpx;
					position: relative;
					
					&.active{
						color: #000;
						font-weight: 600;
						
						&::after{
							content: "";
							display: block;
							width: 30rpx;
							height: 8rpx;
							border-radius: 8rpx;
							background-color: #4ca0f8;
							position: absolute;
							left: 50%;
							bottom: 6rpx;
							transform: translateX(-50%);
						}
					}
				}
			}
		}
	}
</style>