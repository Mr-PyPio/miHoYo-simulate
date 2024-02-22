<template>
	<view class="reviewsList">
		<view class="reviewsItem" v-for="(item,index) in reviewsData" :key="item.reply.reply_id" v-if="reviewsData">
			<ReviewsListItem :item="item"></ReviewsListItem>
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
			<image src="../../static/poseRequlay/noreply.png" mode="widthFix"></image>
		</view>
		
		<view class="reviewEnd" v-if="allShow && !lzReviewReply">
			<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import ReviewsListItem from "./reviewsListItem.vue"
	import {postReplaiesApi,foldedPostRepliesApi} from "../../common/api.js"
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
				loading: false,
				foldReplyNum: 0,
				showFoldReply: false,
				reviewsFoldData: null,
				lzReviewReply: false,
			}
		},
		computed: {
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
				if(this.loading || this.is_last) return
				this.loading = true
				const {data: res} = await postReplaiesApi(this.post_id,this.is_hot,this.order_type,this.last_id,this.only_master)
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
				this.loading = false
			},
			async getFoldedPostReply() {
				const {data: res} = await foldedPostRepliesApi(this.post_id,true)
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
	.reviewsList{
		padding:0 24rpx;
		width: 750rpx;
		box-sizing: border-box;
		overflow: hidden;
		
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
			padding: 15px 0 30px;
			
			image{
				width: 450rpx;
				margin: 0 auto;
				display: block;
			}
		}
	}
</style>