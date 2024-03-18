<template>
	<view @tap.stop="navigatePostReplay(item.refer_id,item.vod_list.length)" class="itemsContents">
		<view class="itemDetailTop">
			<view class="topLeft"  @tap.stop="navigateToUser(item.user.uid)">
				<view class="userImage">
					<image :src="item.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
				</view>
				<view class="userMessage">
					<view class="userName">
						{{item.user.nickname}}
						
						<view class="userLabel">
							{{userLabel}}
						</view>
					</view>
				</view>
			</view>
			<view class="follow" :class="{'following' : is_following}" @tap.stop="followUser(item.user.uid)">
				{{followText}}
			</view>
		</view>
		<view class="itemDetailContent">
			<text class="itemDetailTextTitle" v-if="item.title">
				{{item.title}}
			</text>
			<text class="itemDetailTextContent" v-if="item.summary">
				{{item.summary}}...
			</text>
			
			<item-content :item="item" ref="itemContent"></item-content>
		</view>
		<view class="itemDetailBottom" v-if="item.topic_list.length > 0">
			<view class="topicsName" v-for="(item2,index2) in item.topic_list" :key="index2">
			{{item2.name}}
			</view>
		</view>
	</view>
</template>

<script>
	import {follow,unfollow} from '../../common/api.js'
	import ItemContent from '../../components/common/itemContent.vue'
	export default {
		components: {
			ItemContent
		},
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
				is_following: this.item.user.is_following,
			}
		},
		methods: {
			navigateToUser(uid) {
				// uni.navigateTo({
				// 	url: `/subPackages/user/user?uid=${uid}`,
				// })
				uni.$emit('navPage','user',uid)
			},
			navigatePostReplay(post_id,videoUrl) {
				if(videoUrl) {
					uni.$emit('navPage','postReplay',post_id)
				}else{
					uni.$emit('navPage','artical',post_id)
				}
			},
			async followUser(userId) {
				if(!this.is_following) {
					const {data: res} = await follow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = true
					}
				}else{
					const {data: res} = await unfollow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = false
					}
				}
			},
		},
		computed: {
			userLabel() {
				let game = ''
				switch(this.item.game_id) {
					case 2:
						game = '原神';
					break;
					case 1:
						game = '原神';
					break;
					case 3:
						game = '原神';
					break;
					case 4:
						game = '原神';
					break;
					case 5:
						game = '原神';
					break;
					case 6:
						game = '原神';
					break;
				}
				
				return `在${game}的帖子`
			},
			followText() {
				return this.is_following ? '已关注' : '+ 关注'
			}
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
	.itemsContents{
		margin: 0 -32rpx;
		padding: 12rpx 32rpx;
		background: #f9f9f9;
	}
	.itemDetailTop{
		display: flex;
		justify-content: space-between;
		
		.topLeft{
			display: flex;
			align-items: center;
			height: 30rpx;
			padding: 12rpx;
			
			.userImage{
				width: 30rpx;
				height: 30rpx;
				
				.userAvatarImage{
					width: 30rpx;
					height: 30rpx;
					border-radius: 30rpx;
				}
			}
			
			.userMessage{
				padding-left: 12rpx;
				
				.userName{
					font-size: 24rpx;
					color: #000;			
					display: flex;
					align-items: center;
					
					.userLabel{
						font-size: 22rpx;
						color: #ddd;
						margin-left: 10rpx;
					}
				}
				

			}
		}
		
		.follow{
			color: #3c9cff;
			font-size: 24rpx;
			padding-top: 8rpx;
			
			&.following{
				color: #999;
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
		align-items: center;
		font-size: 22rpx;
		color: #b3b3b3;
		height: 48rpx;
		padding-top: 20rpx;
		
		.topicsName{
			display: block;
			padding:2px 8px ;
			border-radius: 2px;
			background: #eaeaea;
			margin-right: 12rpx;
		}
	}
</style>