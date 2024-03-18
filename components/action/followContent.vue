<template>
	<scroll-view scroll-y="true" style="height: 100%" @scrolltolower="loadMoreDate">
		<view class="contentList" v-if="postData.length">
			<view  v-for="(item,index) in postData" :key="item.entity_id">
				<template v-if="item.entity_type === 1">
					<view class="listItems"  @tap.stop="navigatePostReplay(item.post.post.post_id,item.post.vod_list.length)">
						<view class="itemDetailTop">
							<view class="topLeft"  @tap.stop="navigateToUser(item.post.user.uid)">
								<view class="userImage">
									<image :src="item.post.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
									<image :src="item.post.user.pendant|imageUrlReset(50,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="item.post.user.pendant"></image>
									<image v-if="item.post.user.certification && item.post.user.certification.type"
										:src="`../../static/poseRequlay/certificate${item.post.user.certification.type}.png`" mode="widthFix" class="certificate">
									</image>
								</view>
								<view class="userMessage">
									<view class="userName">
										{{item.post.user.nickname}}
									</view>
									<view class="userLabel">
										{{item.post.post.created_at|changeMonAndDay(item.game_id)}}
									</view>
								</view>
							</view>
						</view>
						<view class="itemDetailContent">
							<text class="itemDetailTextTitle" v-if="item.post.post.subject">
								{{item.post.post.subject}}
							</text>
							<text class="itemDetailTextContent" v-if="item.post.post.content">
								{{item.post.post.content}}
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
					<view class="listItems">
						<view class="itemDetailTop">
							<view class="topLeft"  @tap.stop="navigateToUser(item.instant.user.uid)">
								<view class="userImage">
									<image :src="item.instant.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
									<image :src="item.instant.user.pendant|imageUrlReset(50,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="item.instant.user.pendant"></image>
									<image v-if="item.instant.user.certification && item.instant.user.certification.type"
										:src="`../../static/poseRequlay/certificate${item.instant.user.certification.type}.png`" mode="widthFix" class="certificate">
									</image>
								</view>
								<view class="userMessage">
									<view class="userName">
										{{item.instant.user.nickname}}
									</view>
									<view class="userLabel">
										{{item.instant.instant.created_at|changeMonAndDay(item.game_id)}}
									</view>
								</view>
							</view>
						</view>
						<view class="itemDetailContent">
							<text class="itemDetailTextTitle" v-if="item.instant.instant.content">
								{{item.instant.instant.content}}
							</text>
							
							<template v-if="item.instant.refer_object">
								<user-instant-items2 :item = "item.instant.refer_object"></user-instant-items2>
							</template>
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
				<template v-if="index === 1">
					<view class="recommendUser">
						<follow-recommend-active :categroyId="categroyId"></follow-recommend-active>
					</view>
				</template>
			</view>
			<view class="reviewEnd" v-if="allShow">
				<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix"  class="image"></image>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	import {getTimelineList} from '@/common/api.js'
	import ItemContent from '../../components/common/itemContent.vue'
	import UserInstantItems2 from '../../components/user/userInstantItems2.vue'
	import FollowRecommendActive from './followRecommendActive.vue'
	export default{
		components: {
			ItemContent,
			UserInstantItems2,
			FollowRecommendActive
		},
		data() {
			return {
				categroyId : 0,
				is_last: false,
				loading: false,
				next_offset: null,
				postData: []
			}
		},
		computed: {
			...mapState(['actionPage']),
			allShow() {
				return this.is_last
			},
		},
		methods: {
			...mapMutations(['updateActionPage']),
			async getPostData(id) {
				const {data: res} = await getTimelineList(id)
				if(res.data) {
					this.postData = res.data.list
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
					this.updateActionPage({
						name: 'follow',
						data: {
							'postData': this.postData,
							'is_last' : this.is_last,
							'next_offset' : this.next_offset
						}
					})
				}
			},
			async loadMoreDate() {
				if(this.loading) {
					return
				}else{
					this.loading = true
				}
				if(!this.is_last ) {
					const {data: res} = await getTimelineList(this.categroyId,this.next_offset)
					if(res.data) {
						this.postData.push(...res.data.list)
						this.is_last = res.data.is_last
						this.next_offset = res.data.next_offset
						this.updateActionPage({
							name: 'follow',
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
			navigateToUser(uid) {
				// uni.navigateTo({
				// 	url: `/subPackages/user/user?uid=${uid}`,
				// })
				uni.$emit('navPage','user',uid)
			}
		},
		created() {
			if(this.actionPage.follow) {
				this.postData = this.actionPage.follow.postData
				this.is_last = this.actionPage.follow.is_last
				this.next_offset = this.actionPage.follow.next_offset
			}else{
				this.getPostData(this.categroyId)
			}
		},
		filters: {
			changeMonAndDay(value,id) {
				const nowDate = new Date()
				const date = new Date(parseInt(value) * 1000)
				const nowDay = nowDate.getDate()
				const day = date.getDate()
				let gameName = ''
				if(id === '2') gameName = '原神'
				if(id === '1') gameName = '崩坏'
				if(id === '6') gameName = '崩坏：星穹铁道'
				if(id === '3') gameName = '崩坏学院2'
				if(id === '4') gameName = '未定事件簿'
				if(id === '8') gameName = '绝区零'
				if(id === '5') gameName = '大别野'
				if(nowDay === day) {
					const nowHours = nowDate.getHours()
					const nowMinutes= nowDate.getMinutes()
					const hours = date.getHours()
					const minutes = date.getMinutes()
					if(nowHours - hours <= 1) {
						return `${nowMinutes - minutes + 60}分钟前 · 在${gameName}发布了帖子`
					}else{
						return `${nowHours - hours}小时前 · 在${gameName}发布了帖子`
					}
				}
				const createDay = day < 10 ? `0${day}` : day
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				const nowYear = nowDate.getFullYear()
				const year = date.getFullYear()
				if(nowYear === year) {
					return `${date.getMonth() + 1}月${day} · 在${gameName}发布了帖子`
				}else{
					return `${date.getFullYear()}年${date.getMonth() + 1}月${day} · 在${gameName}发布了帖子`
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
				display: flex;
				align-items: center;
				height: 72rpx;
				padding: 12rpx;
				
				.userImage{
					width: 72rpx;
					height: 72rpx;
					position: relative;
					
					.userAvatarImage{
						width: 72rpx;
						height: 72rpx;
						border-radius: 72rpx;
					}
					
					.userAvatarFrameImage{
						width: 84rpx;
						height: 84rpx;
						position: absolute;
						left: -6rpx;
						top: -6rpx;
					}
					
					
					
					.certificate{
						position: absolute;
						right: -2rpx;
						bottom: -2rpx;
						width: 24rpx;
						height: 24rpx;
					}
				}
				
				.userMessage{
					padding-left: 12rpx;
					
					.userName{
						font-size: 24rpx;
						color: #000;
					}
					
					.userLabel{
						font-size: 22rpx;
						color: #ddd;
					}
				}
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
				color:#7f858a;
				display: block;
				margin-bottom: 6px;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
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
		
		.reviewEnd{
			padding: 15px 0 30px;
			
			.image{
				width: 450rpx;
				margin: 0 auto;
				display: block;
			}
		}
	}
</style>