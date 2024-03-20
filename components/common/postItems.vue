<template>
	<view class="content" >
		<view style="padding: 24rpx 24rpx 0;" @tap.stop="navigatePostReplay(item.post.post_id)">
			<view class="itemDetailTop">
				<view class="topLeft"  @tap.stop="navigateToUser(item.user.uid)">
					<view class="userImage">
						<image :src="item.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
						<image :src="item.user.pendant|imageUrlReset(50,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="item.user.pendant"></image>
						<image v-if="item.user.certification && item.user.certification.type"
							:src="`${imageBaseUrl}poseRequlay/certificate${item.user.certification.type}.png`" mode="widthFix" class="certificate">
						</image>
					</view>
					<view class="userMessage">
						<view class="userName">
							{{item.user.nickname}}
						</view>
						<view class="userLabel">
							{{item.post.created_at|changeMonAndDay}}
						</view>
					</view>
				</view>
				<view class="topRight">
					<u-icon name="more-dot-fill" color="#ddd" size="32"></u-icon>
				</view>
			</view>
			<view class="itemDetailContent">
				<text class="itemDetailTextTitle" v-if="item.post.subject">
					{{item.post.subject}}
				</text>
				<text class="itemDetailTextContent" v-if="item.post.content">
					{{item.post.content}}...
				</text>
				
				<item-content :item="item" ref="itemContent"></item-content>
			</view>
			<view class="itemDetailBottom">
				<view class="topicsName" v-if="item.topics.length > 0">
				{{item.topics[0].name}}
				</view>
				<view class="itemDetail">
					<u-icon name="thumb-up" color="#ddd" size="46"></u-icon>
					{{item.stat.like_num}}
				</view>
				<view class="itemDetail">
					<u-icon name="chat" color="#ddd" size="46"></u-icon>
					{{item.stat.reply_num}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import ItemContent from './itemContent.vue'
	export default {
		components: {
			ItemContent
		},
		name:"postItems",
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
			};
		},
		computed: {
			...mapState(['imageBaseUrl'])
		},
		methods: {
			navigatePostReplay(post_id) {
				const videoUrl = this.$refs.itemContent.videoUrl
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
		filters: {
			changeMonAndDay(value) {
				const date = new Date(parseInt(value) * 1000)
				const createDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${createMon}-${createDay}`
			}
		},
	}
</script>

<style lang="scss" scoped>
.itemDetailTop{
	display: flex;
	justify-content: space-between;
	
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
	
	.topRight{
		padding-top: 24rpx;
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
		color: #7f858a;
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
</style>