<template>
	<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="scrolltolower">
		<view class="contentList" v-if="postData.length">
			<view class="listItems" v-for="(item,index) in postData" :key="item.entity_id">
				<template v-if="item.entity_type === 1">
					<view  @tap.stop="navigatePostReplay(item.post.post.post_id,item.post.vod_list.length)">
						<view class="itemDetailTop">
							<view class="topLeft">
								{{item.post.post.created_at|changeMonAndDay}}
							</view>
							<view class="topRight">
								<u-icon name="more-dot-fill" color="#ddd" size="32"></u-icon>
							</view>
						</view>
						<view class="itemDetailContent">
							<text class="itemDetailTextTitle" v-if="item.post.post.subject">
								{{item.post.post.subject}}
							</text>
							<text class="itemDetailTextContent" v-if="Number(item.post.post.content)">
								{{item.post.post.content}}...
							</text>
							
							<item-content :item="item.post" ref="itemContent"></item-content>
						</view>
						<view class="itemDetailBottom">
							<view class="topicsName" v-if="item.post.topics.length > 0">
							{{item.post.topics[0].name}}
							</view>
							<view class="itemDetail">
								<u-icon name="thumb-up" color="#ddd" size="46"></u-icon>
								{{item.post.stat.like_num}}
							</view>
							<view class="itemDetail">
								<u-icon name="chat" color="#ddd" size="46"></u-icon>
								{{item.post.stat.reply_num}}
							</view>
						</view>
					</view>
				</template>
				<template v-if="item.entity_type === 2">
					<view class="">
						<view class="itemDetailTop">
							<view class="topLeft">
								{{item.instant.instant.created_at|changeMonAndDay}}
							</view>
							<view class="topRight">
								<u-icon name="more-dot-fill" color="#ddd" size="32"></u-icon>
							</view>
						</view>
						<view class="itemDetailContent">
							<text class="itemDetailTextTitle" v-if="item.instant.instant.content">
								{{item.instant.instant.content}}
							</text>
							
							<user-instant-items2 :item = "item.instant.refer_object"></user-instant-items2>
						</view>
						<view class="itemDetailBottom">
							<view class="itemDetail">
								<u-icon name="thumb-up" color="#ddd" size="46"></u-icon>
								{{item.instant.stat.like_num}}
							</view>
							<view class="itemDetail">
								<u-icon name="chat" color="#ddd" size="46"></u-icon>
								{{item.instant.stat.reply_num}}
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<view class="reviewEnd" v-if="allShow">
			<image :src="imageBaseUrl + 'poseRequlay/reviewEnd.png'" mode="widthFix"  class="image"></image>
		</view>
		<view class="noLimit" v-if="!limit">
			<image :src="imageBaseUrl + 'user/noLimit.png'" mode="widthFix" class="logo"></image>
		</view>
	</scroll-view>
</template>

<script>
	import {getUserInstantList} from "../../common/api.js"
	import ItemContent from '../../components/common/itemContent.vue'
	import UserInstantItems2 from './userInstantItems2.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			ItemContent,
			UserInstantItems2
		},
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
				next_offset: null,
				limit: true,
			}
		},
		computed: {
			...mapState(['imageBaseUrl']),
			allShow() {
				return this.is_last
			},
		},
		methods: {
			async getDate() {
				const {data: res} = await getUserInstantList(this.uid)
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
				const {data: res} = await getUserInstantList(this.uid,this.next_offset)
				if(res.data) {
					this.postData.push(...res.data.list)
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
				}
			},
			navigatePostReplay(post_id,videoUrl) {
				if(videoUrl) {
					// uni.navigateTo({
					// 	url: `/subPackages/postReplay/postReplay?post_id=${post_id}`,
					// })
					uni.$emit('navPage','postReplay',post_id)
				}else{
					// uni.navigateTo({
					// 	url: `/subPackages/artical/artical?post_id=${post_id}`,
					// })
					uni.$emit('navPage','artical',post_id)
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
		
		.listItems{
			padding: 0 32rpx;
			margin-top: 28rpx;
			border-bottom: 4px solid #f5f5f5;
		}
		.itemDetailTop{
			display: flex;
			justify-content: space-between;
			margin-bottom: 12rpx;
			
			.topLeft{
				font-size: 24rpx;
				color: #ddd;
			}
			
			.topRight{
				box-sizing: border-box;
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
			
			.itemDetailTextContent{
				font-size: 26rpx;
				line-height: 1.5;
				color: #ddd;
				display: block;
				margin-bottom: 6px;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 4;
			}
		}
		
		.itemDetailBottom{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			position: relative;
			font-size: 22rpx;
			color: #999;
			height: 48rpx;
			padding: 20rpx 0 24rpx;
			
			.topicsName{
				position: absolute;
				left: 0;
				display: block;
				padding:2px 8px ;
				border-radius: 2px;
				background: #f7f7f7;
			}
			
			.itemDetail{
				display: flex;
				align-items: center;
				padding-left: 24rpx;
			}
		}
	}
		
		.reviewEnd{
			padding: 15px 0 30px;
			
			.image{
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
</style>