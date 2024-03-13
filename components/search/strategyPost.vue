<template>
	<view class="content" :style="{'height': scrollHeight}">
		<scroll-view :scroll-y="true" :style="{'height': scrollHeight}" @scrolltolower="scrollBottom">
			<view class="edition">
				<view class="editionTop">
					<view class="editionTopLeft">
						<image src="../../static/poseRequlay/screen.png" mode="widthFix"></image>
						{{editionType}}
					</view>
					<view class="editionTopRight">
						<view class="leftType" :class="{'active': leftType === 'hot'}">
							按热度
						</view>
						<view class="leftType" :class="{'active': leftType === 'time'}">
							按时间
						</view>
					</view>
				</view>
			</view>
			<view class="postList" v-if="postData">
				<view v-for="(item,index) in postData"  :key="item.post_id">
					<SearchPostItem :item="item" :keyWord="keyWord"></SearchPostItem>
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
	import SearchPostItem from '../common/searchPostItem.vue'
	import {searchPost} from '../../common/api.js'
	export default {
		name: 'strategyPost',
		components: {
			SearchPostItem
		},
		data() {
			return {
				loading: false,
				scrollHeight: 0,
				postData: null,
				editionData: null,
				editionType: '原神板块',
				leftType: 'hot',
				last_id: null,
				is_last: false,
				keyWord: '',
				upDateLoading: false,
			}
		},
		methods: {
			async initData(keyWord) {
				this.loading = true
				this.keyWord = keyWord
				const {data: res} = await searchPost(this.keyWord, 1)
				const dataNew = res.data
				this.last_id = dataNew.last_id
				this.is_last = dataNew.is_last
				this.postData = dataNew.posts
				setTimeout(() => {
					this.loading = false
				},300)
			},
			async scrollBottom() {
				if(!this.upDateLoading && !this.is_last) {
					this.upDateLoading = true
					const {data: res} = await searchPost(this.keyWord,1,this.last_id)
					const dataNew = res.data
					this.last_id = dataNew.last_id
					this.is_last = dataNew.is_last
					this.postData.push(...dataNew.posts)
					this.upDateLoading = false
				}
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
	.content{
		.edition{
			.editionTop{
				padding: 24rpx;
				display: flex;
				justify-content: space-between;
				font-size: 20rpx;
				color: #333;
				
				.editionTopLeft{
					height: 48rpx;
					line-height: 48rpx;
					display: flex;
					align-items: center;
					padding: 0 14rpx;
					border: 1px solid #f8f8f8;
					box-sizing: border-box;
					
					image{
						width: 24rpx;
						margin-right: 10rpx;
					}
				}
				
				.editionTopRight{
					height: 48rpx;
					line-height: 48rpx;
					display: flex;
					align-items: center;
					background: #fff;
					
					.leftType{
						padding: 0 12rpx;
						background: #f8f8f8;
						color: #999;
						box-sizing: border-box;
						
						&.active{
							border: 1px solid #f8f8f8;
							background: #fff;
							color: #333;
						}
					}
	
				}
			}
		}
	}
	.loading2{
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
	}
	
	.reviewEnd{
		padding: 15px 0 30px;
		
		.image{
			width: 450rpx;
			margin: 0 auto;
			display: block;
		}
	}
</style>