<template>
	<scroll-view scroll-y="true" style="height: 100%;">
		<view class="topBanner">
			<swiper  :autoplay="true" :interval="3000" style="width: 702rpx;height: 324rpx;"
				indicator-dots="true" indicator-color="#b5bdbe" indicator-active-color="#19a3ff">
				<swiper-item v-for="(item,index) in toBanner" :key="index">
					<view class="swiper-item">
						<image :src="item.cover|imageUrlReset(400,80)" mode="aspectFit" class="banner"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="hotPost">
			<view class="hotPostTop">
				<view class="hotPostTopLeft">
					全社热帖榜
				</view>
				<view class="hotPostTopRight">
					全部
					<u-icon name="arrow-right" color="#c6cbce" size="16" style="margin-left: 4rpx;"></u-icon>
				</view>
			</view>
			<view class="hotPostContent">
				<view v-for="(item,index) in hotPost" :key="index" class="hotPostItem">
					<image :src="'../../static/NO'+ (index+1) + '.png'" mode="widthFix" class="itemSort"></image>
					<view class="itemHot">
						<image src="../../static/hot2.png" mode="widthFix" class="hotIcon"></image>
						{{item.post.score|resetNum2}}
					</view>
					<view class="itemDisc overfllowOne">
						{{item.post.subject}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="hotSearchKeyWords">
			<view class="hotSearchKeyWordsTop">
				全社热搜
			</view>
			<view class="hotKeywords">
				<view v-for="(item,index) in hotSearch" :key="item.id" class="keywordsItems" @tap.stop="search(item.keyword)">
					{{item.keyword}}
					<image src="../../static/hot.png" mode="widthFix" class="hotIcon2" v-if="index < 3"></image>
				</view>
			</view>
		</view>
		
		<view class="channel">
			<view class="channelTop">
				全部频道
			</view>
			<view class="channelContent">
				<view class="channelItems" v-for="(item,index) in channel" :key="item.id">
					<view class="channelGame">
						<image :src="item.icon" mode="widthFix" class="gameIcon"></image>
						<view class="rightWrap">
							<view class="channelDisc">
								<view class="gameName">
									{{item.name}}
								</view>
								<view class="channelView">
									{{item.num.discuss}}人讨论
								</view>
							</view>
							<u-icon name="arrow-right" color="#c1c6c9" size="24"></u-icon>
						</view>
					</view>
					<view class="channelHotList" v-if="item.selection_post_list.length">
						<view class="channelHotListTop">
							<view class="channelHotListTopLeft">
								频道每月热榜
							</view>
							<view class="channelHotListTopRight">
								全部
								<u-icon name="arrow-right" color="#c6cbce" size="16" style="margin-left: 4rpx;"></u-icon>
							</view>
						</view>
						<view class="channelHotListContent">
							<view class="listItem" v-for="(item2,index2) in item.selection_post_list" :key="item2.post_id">
								<view class="listItemIcon">
									{{item2.forum_name}}
								</view>
								<view class="listItemText">
									{{item2.subject}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {mapMutations,mapState} from "vuex"
	import {discover} from '@/common/api.js'
	export default{
		data() {
			return {
				toBanner: null,
				hotPost: null,
				hotSearch: null,
				channel: null,
			}
		},
		computed: {
			...mapState(['actionPage'])
		},
		methods: {
			...mapMutations(['updateActionPage']),
			async getPostData() {
				const {data: res} = await discover()
				if(res.data) {
					this.toBanner = res.data.carousels
					this.hotPost = res.data.hot_posts
					this.hotSearch = res.data.hot_keywords
					this.channel = res.data.forum_games
					this.updateActionPage({
						name: 'find',
						data: {
							'toBanner': this.toBanner,
							'hotPost' : this.hotPost,
							'hotSearch' : this.hotSearch,
							'channel' : this.channel,
						}
					})
				}
			},
			search(keyword) {
				uni.navigateTo({
					url: `/subPackages/search/search?keyword=${keyword}`,
				})
			}
		},
		created() {
			if(this.actionPage.find) {
				this.toBanner = this.actionPage.find.toBanner
				this.hotPost = this.actionPage.find.hotPost
				this.hotSearch = this.actionPage.find.hotSearch
				this.channel = this.actionPage.find.channel
			}else{
				this.getPostData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topBanner{
		background: #f7f7f7;
		padding: 36rpx 24rpx 24rpx;
		
		.swiper-item{
			width: 702rpx;
			height: 324rpx;
			
			.banner{
				width: 702rpx;
				height: 324rpx;
				border-radius: 16rpx;
			}
		}
	}
	
	.hotPost{
		padding: 24rpx;
		padding-bottom: 0;
		border-bottom: 4px solid #f7f7f7;
		
		.hotPostTop{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			color: #000;
			margin-bottom: 12rpx;
			
			.hotPostTopRight{
				display: flex;
				align-items: center;
				font-size: 20rpx;
				color: #c6cbce;
			}
			
		}
		
		.hotPostContent{
			
			.hotPostItem{
				overflow: hidden;
				
				&:last-of-type{
					.itemDisc,.itemHot{
						border: 0;
					}
				}
			}
			
			.itemSort{
				width: 48rpx;
				margin-right: 12rpx;
				float: left;
				padding-top: 8rpx;
			}
			
			.itemDisc{
				font-size: 24rpx;
				color: #000;
				line-height: 44rpx;
				padding: 20rpx 12rpx 20rpx 0;
				border-bottom: 1px solid  #f6f6f6;
				
			}
			
			.itemHot{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: 20rpx;
				color: #c0c5c8;
				float: right;
				height: 44rpx;
				padding: 20rpx 0;
				border-bottom: 1px solid  #f6f6f6;
				
				
				.hotIcon{
					width: 24rpx;
					margin-right: 6rpx;
				}
			}
			
			
		}
		
	}
	
		
	.hotSearchKeyWords{
		padding: 24rpx;
		border-bottom: 4px solid #f7f7f7;
			
		.hotSearchKeyWordsTop{
			font-size: 28rpx;
			color: #000;
			margin-bottom: 12rpx;
		}
		
		.hotKeywords{
			display: flex;
			flex-wrap: wrap;
			
			.keywordsItems{
				width: 50%;
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #000;
				padding: 12rpx 0;
				
				.hotIcon2{
					width: 20rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
	.channel{
		padding: 24rpx;
		
		
		.channelTop{
			font-size: 28rpx;
			color: #000;
			margin-bottom: 12rpx;
		}
		
		.channelContent{
			.channelItems{
				padding: 24rpx 0;
				border-bottom: 1px solid #f7f7f7;
				
				&:last-of-type{
					border: 0;
				}
				
				.channelGame{
					display: flex;
					align-items: center;
					position: relative;
					
					.gameIcon{
						width: 80rpx;
						margin-right: 16rpx;
						border-radius: 16rpx;
					}
					
					.rightWrap{
						width: calc(100% - 96rpx);
						display: flex;
						justify-content: space-between;
						align-items: center;
						
						.gameName{
							font-size: 26rpx;
							color: #000;
							padding-bottom: 2rpx;
						}
						
						.channelView{
							font-size: 22rpx;
							color: #80868b;
						}
					}
				}
				
				.channelHotList{
					padding: 16rpx;
					border-radius: 16rpx;
					background: #f7f7f7;
					margin-top: 16rpx;
					
					.channelHotListTop{
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 20rpx;
						color: #000;
						margin-bottom: 12rpx;
						
						.channelHotListTopRight{
							display: flex;
							align-items: center;
							font-size: 20rpx;
							color: #c6cbce;
						}
					}
					
					.channelHotListContent{
						
						.listItem{
							display: flex;
							align-items: center;
							font-size: 20rpx;
							color: #b6babd;
							padding: 8rpx 0;
							
							.listItemIcon{
								display: inline-block;
								padding: 1rpx 4rpx;
								border: 1px solid #fe7d3c;
								border-radius: 6rpx;
								color: #fe7d3c;
								margin-right: 12rpx;
							}
						}
					}
				}
			}
		}
	}
	
	
	.overfllowOne{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>