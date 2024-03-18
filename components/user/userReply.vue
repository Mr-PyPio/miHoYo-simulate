<template>
	<scroll-view scroll-y="true" style="height: 100%;"  @scrolltolower="scrolltolower">
		<view class="contentList">
			<view class="postList">
				<view class="listItems" v-for="(item,index) in postData" :key="item.post.reply.reply_id">
					<view  @tap.stop="">
						<view class="itemDetailTop">
							<view class="topLeft">
								{{item.post.reply.created_at|changeMonAndDay}}
							</view>
						</view>
						<view class="itemDetailContent">
							<text class="itemDetailTextTitle" v-if="item.post.reply.content">
								{{item.post.reply.content}}
							</text>
							
							<view class="replayContent">
								{{getReplayContent(item.post)}}
							</view>
						</view>
					</view>
				</view>
				<view class="reviewEnd" v-if="allShow">
					<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix" class="logo"></image>
				</view>
				<view class="noLimit" v-if="!limit">
					<image src="../../static/user/noLimit.png" mode="widthFix" class="logo"></image>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {getUserReply} from "../../common/api.js"
	export default {
		props: {
			uid: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				postData: [],
				is_last: false,
				loading: false,
				limit: true,
				next_offset: null
			}
		},
		computed: {
			allShow() {
				return this.is_last
			},
		},
		methods: {
			async getDate() {
				const {data: res} = await getUserReply(this.uid)
				if(res.message === "权限不足") {
					this.limit = false
				}
				if(res.data) {
					this.postData = res.data.list
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
				}
			},
			async loadMoreDate() {
				const {data: res} = await getUserReply(this.uid,this.next_offset)
				if(res.data) {
					this.postData.push(...res.data.list)
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
				}
			},
			getReplayContent(data) {
				if(data.r_reply) {
					return `回复帖子: ${data.r_reply.content}`
				}else{
					return `回复帖子: ${data.r_post.subject}`
				}
			},
			scrolltolower() {
				if(!this.is_last) {
					this.loadMoreDate()
				}
			}
		},
		created() {
			this.getDate()
		},
		filters: {
			changeMonAndDay(value) {
				const nowDate = new Date()
				const date = new Date(parseInt(value) * 1000)
				const nowDay = nowDate.getDate()
				const day = date.getDate()
				if(nowDay === day) {
					const nowHours = nowDate.getHours()
					const nowMinutes= nowDate.getMinutes()
					const hours = date.getHours()
					const minutes = date.getMinutes()
					if(nowHours == hours) {
						return `${nowMinutes - minutes}分钟前 · 原神`
					}else{
						return `${nowHours - hours}小时前 · 原神`
					}
				}
				const createDay = day < 10 ? `0${day}` : day
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				const nowYear = nowDate.getFullYear()
				const year = date.getFullYear()
				if(nowYear === year) {
					return `${date.getMonth() + 1}月${day} · 原神`
				}else{
					return `${date.getFullYear()}年${date.getMonth() + 1}月${day} · 原神`
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.contentList{
		padding: 0 32rpx;
		.listItems{
			margin-top: 30rpx;
			border-bottom: 1px solid #f5f5f5;
			padding-bottom: 22rpx;
			.itemDetailTop{
				display: flex;
				justify-content: space-between;
				
				.topLeft{
					font-size: 24rpx;
					color: #ddd;
				}
			}
			.itemDetailContent{
				.itemDetailTextTitle{
					font-size: 28rpx;
					line-height: 1.5;
					padding: 8rpx 0;
					color: #000;
					display: block;
				}
				
				.replayContent{
					padding: 16rpx;
					border-radius: 4px;
					background: #f8f8f8;
					color: #cbcbcb;
					font-size: 24rpx;
				}
			}
		}
		.reviewEnd{
			padding: 15px 0 60px;
			
			.logo{
				width: 450rpx;
				margin: 0 auto;
				display: block;
			}
		}
		.noLimit{
			padding: 15px 0 60px;
			
			.logo{
				width: 580rpx;
				margin: 0 auto;
				display: block;
			}
		}
	}
</style>