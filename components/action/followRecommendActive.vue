<template>
	<view class="recommendContent" v-if="postData" @touchmove.stop="tochMoveStop">
		<view class="wrapTop">
			<view class="wrapTopLeft">
				推荐用户
			</view>
			<view class="wrapTopRight">
				全部
				<u-icon name="arrow-right" color="#c6cbce" size="16" style="margin-left: 4rpx;"></u-icon>
			</view>
		</view>
		<scroll-view scroll-x="true"  @scrolltolower="loadMoreDate">
			<view class="recommendUserWrap">
				<view v-for="(item,index) in postData" :key="item.user.uid">
					<view class="recommendItems">
						<view class="userImage">
							<image :src="item.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
							<image v-if="item.user.certification && item.user.certification.type"
								:src="`../../static/poseRequlay/certificate${item.user.certification.type}.png`" mode="widthFix" class="certificate">
							</image>
						</view>
						<view class="name overfllowOne">
							{{item.user.nickname}}
						</view>
						<view class="certification overfllowOne">
							{{item.user.showText.row2Text}}
						</view>
						<view class="fan overfllowOne">
							{{item.user.showText.row3Text}}
						</view>
						<view class="follow" @tap.stop="followUser(item.user.uid,index)">
							+ 关注
						</view>
					</view>
				</view>
				
				<view class="loading">
					<u-loading-icon color=" #d2d5d8" size="24"></u-loading-icon>
					正在加载中
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from "vuex"
	import {recommendActive,follow} from '@/common/api.js'
	export default{
		props: {
			categroyId: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		data() {
			return {
				postData: null,
				loading: false
			}
		},
		computed: {
			...mapState(['actionPage'])
		},
		methods: {
			...mapMutations(['updateActionPage']),
			async getPostData() {
				const {data: res} = await recommendActive(this.categroyId)
				this.postData = res.data.list
				this.is_last = res.data.is_last
				this.next_offset = res.data.next_offset
				this.updateActionPage({
					name: 'recommendActive',
					data: {
						'postData': this.postData,
						'is_last' : this.is_last,
						'next_offset' : this.next_offset
					}
				})
			},
			async loadMoreDate() {
				if(this.loading) {
					return
				}else{
					this.loading = true
				}
				if(!this.is_last ) {
					const {data: res} = await recommendActive(this.categroyId,this.next_offset)
					if(res.data) {
						this.postData.push(...res.data.list)
						this.is_last = res.data.is_last
						this.next_offset = res.data.next_offset
						this.updateActionPage({
							name: 'recommendActive',
							data: {
								'postData': this.postData,
								'is_last' : this.is_last,
								'next_offset' : this.next_offset
							}
						})
						this.loading = false
					}
				}

			},
			async followUser(userId,index) {
				const {data: res} = await follow({
					 "entity_id": userId
				})
				if(res.message === 'OK'){
					this.postData.splice(index,1)
					if(this.postData.length < 4) {
						this.loadMoreDate()
					}
				}
			},
			tochMoveStop(event) {
				event.stopPropagation();
			},
		},
		created() {
			if(this.actionPage.recommendActive) {
				this.postData = this.actionPage.recommendActive.postData
				this.is_last = this.actionPage.recommendActive.is_last
				this.next_offset = this.actionPage.recommendActive.next_offset
			}else{
				this.getPostData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recommendContent{
		padding: 24rpx;
		padding-right: 0;
		background: #f8f8f8;
		
		.wrapTop{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			color: #000;
			font-weight: 600;
			margin-bottom: 12rpx;
			
			.wrapTopRight{
				display: flex;
				align-items: center;
				margin-right: 24rpx;
				font-size: 20rpx;
				color: #c6cbce;
			}
			
		}
		
		.recommendUserWrap{
			display: flex;
			
			.loading{
				width: 30rpx;
				font-size: 20rpx;
				color: #d2d5d8;
				padding-top: 80rpx;
			}
			
			.recommendItems{
				background: #fff;
				margin-right: 8px;
				border-radius: 6px;
				padding: 24rpx;
				box-sizing: border-box;
				text-align: center;
				width: 236rpx;
				
				
				.userImage{
					width: 100rpx;
					height: 100rpx;
					position: relative;
					margin: 0 auto;
					
					.userAvatarImage{
						width: 100rpx;
						height: 100rpx;
						border-radius: 100rpx;
					}
					
					.certificate{
						position: absolute;
						right: -2rpx;
						bottom: -2rpx;
						width: 24rpx;
						height: 24rpx;
					}
				}
				
				.name{
					font-size: 26rpx;
					color: #000;
					padding-top: 10rpx;
				}
				
				.certification{
					padding-top: 10rpx;
					font-size: 24rpx;
					color:#b4b8ba ;
				}
				
				.fan{
					padding-top: 10rpx;
					font-size: 20rpx;
					color: #d2d5d8;
				}
				
				.overfllowOne{
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					width: 100%;
				}
				
				
				.follow{
					padding: 3px;
					width: 188rpx;
					border-radius: 3px;
					background: #3c9cff;
					color: #fff;
					text-align: center;
					font-size: 20rpx;
					margin-top: 16rpx;
					box-sizing: border-box;
				}
			}
		}
	}
</style>