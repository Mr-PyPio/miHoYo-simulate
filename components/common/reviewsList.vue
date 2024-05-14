<template>
	<view class="reviewsList"  :style="{'min-height': windowHeight - 350 + 'px'}">
		<view class="reviewsItem" v-for="(item,index) in reviewsData" :key="item.reply.reply_id" v-if="reviewsData">
			<ReviewsListItem :item="item"></ReviewsListItem>
		</view>
		
		<view class="loading" v-if="!allShow">
			<u-loading-icon mode="circle" size="42"></u-loading-icon>
		</view>
		
		<view class="reviewFold" v-if="foldReplyNum > 0 && is_last && !showFoldReply" @tap.stop="showFoldReplyEvent">
			{{foldReplyNum}}条评论被折叠 <u-icon name="arrow-down" color="#b3b3b3" size="24" style="position: relative;top: 3rpx;left: 3px;"></u-icon>
		</view>
		
		<view class="reviewFoldReplyState" v-if="showFoldReply">
			<view class="state1">
				以下是被折叠的评论
			</view>
			<view class="state2">
				部分评论疑似包含重复或不友善等被多人点踩内容
			</view>
		</view>
		
		<view class="reviewFoldReplyItem reviewsItem" v-if="showFoldReply" v-for="(item,index) in reviewsFoldData" :key="index">
			<ReviewsListItem :item="item"></ReviewsListItem>
		</view>
		
		<view class="reviewEnd" v-if="allShow && lzReviewReply">
			<image :src="imageBaseUrl + 'poseRequlay/noreply.png'" mode="widthFix" class="image"></image>
			<view class="text">
				楼主还没有回复哦
			</view>
		</view>
		
		<view class="reviewEnd" v-if="allShow && !lzReviewReply">
			<image :src="imageBaseUrl + 'poseRequlay/reviewEnd.png'" mode="widthFix" class="image"></image>
		</view>
	</view>
</template>

<script>
	import ReviewsListItem from "./reviewsListItem.vue"
	import {postReplaiesApi,foldedPostRepliesApi} from "../../common/api.js"
	import {mapState} from 'vuex'
	export default {
		props: {
			post_id: {
				type: String,
				default() {
					return null
				}
			}
		},
		components: {
			ReviewsListItem
		},
		data() {
			return {
				last_id: 0,
				is_hot: true,
				order_type: 0,
				only_master: false,
				is_last: false,
				reviewsData: null,
				foldReplyNum: 0,
				showFoldReply: false,
				reviewsFoldData: null,
				lzReviewReply: false,
			}
		},
		computed: {
			...mapState(['imageBaseUrl','windowHeight']),
			allShow() {
				if(this.foldReplyNum) {
					return this.showFoldReply && this.is_last
				}else{
					return this.is_last
				}
			}
		},
		methods: {
			async getPostReplayData(type,callBack,isChange) {				
				if(type === 'refresh') {
					this.last_id = 0
				}
				if(isChange) this.is_last = false
				if(this.is_last) return
				const {data: res} = await postReplaiesApi(this.post_id,this.is_hot,this.order_type,this.last_id,this.only_master,5)
				this.last_id =  res.data.last_id
				this.is_last = res.data.is_last
				this.foldReplyNum = res.data.fold_reply_num
				if(type === 'update') {
					this.reviewsData.push(...res.data.list)
				}else{
					this.reviewsData = res.data.list
				}
				if(callBack) {
					callBack()
				}
			},
			async getFoldedPostReply() {
				const {data: res} = await foldedPostRepliesApi(this.post_id,true,10)
				this.last_id =  res.data.last_id
				this.is_last = res.data.is_last
				this.reviewsFoldData = res.data.list
				this.showFoldReply = true
			},
			showFoldReplyEvent() {
				this.getFoldedPostReply()
			}
		},
		created() {
			this.getPostReplayData()
		}
	}
</script>

<style lang="scss" scoped>
	
	.loading{
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
		background: #fff;
	}
	
	.reviewsList{
		padding:0 24rpx;
		width: 750rpx;
		box-sizing: border-box;
		overflow: hidden;
		padding-bottom: 20px;
		
		.reviewFoldReplyState{
			background: #f2f4f5;
			border-radius: 12px;
			margin: 15px 0 25px;
			text-align: center;
			padding: 15px 0;
			
			.state1{
				color: #222;
				font-weight: 600;
				font-size: 30rpx;
			}
			
			.state2{
				padding-top: 3px;
				color: #b3b3b3;
				font-size: 22rpx;
			}
		}
		
		.reviewFold{
			font-size:24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 20px;
			color: #b3b3b3;
		}
		
		.reviewEnd{
			padding: 15px 0 50px;
			
			.image{
				width: 450rpx;
				margin: 0 auto;
				display: block;
			}
			
			.text{
				font-size: 32rpx;
				color: #b8bec1;
				text-align: center;
			}
		}
	}
</style>