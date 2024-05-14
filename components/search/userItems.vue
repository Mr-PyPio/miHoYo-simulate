<template>
	<view class="itemContent" @tap.stop="navigateToUser(item.uid)">
		<view class="userLogo">
			<image class="userLogoImage" :src="item.avatar_url" mode="widthFix"></image>
		</view>
		<view class="userMessage">
			<view class="userName" v-html="matchText(item.nickname)">
			</view>
			<view class="userDesc">
				{{item.introduce}}
			</view>
			<view class="userAchieve">
				粉丝数:{{new_follower_num}}&nbsp;
				获赞数:{{item.achieve.like_num}}
			</view>		
			<view class="follow" :class="{'following' : is_following}" @tap.stop="followUser(item.uid)">
				{{followText}}
			</view>
		</view>
	</view>
</template>

<script>
	import {follow,unfollow} from '../../common/api.js'
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			},
			keyWord: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				is_following: this.item.is_following,
				new_follower_num: Number(this.item.achieve.new_follower_num)
			}
		},
		computed: {
			followText() {
				return this.is_following ? '已关注' : '+ 关注'
			}
		},
		methods: {
			matchText(text) {
				const reg = new RegExp(`${this.keyWord}`,'g')
				return text.replace(reg, `<span style="color: #71e0fe">${this.keyWord}</span>`)
			},
			async followUser(userId) {
				if(!this.is_following) {
					const {data: res} = await follow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = true
						this.new_follower_num += 1
					}
				}else{
					const {data: res} = await unfollow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = false
						this.new_follower_num -= 1
					}
				}
			},
			navigateToUser(uid) {
				// uni.navigateTo({
				// 	url: `/subPackages/user/user?uid=${uid}`,
				// })
				uni.$emit('navPage','user',uid)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.itemContent{
		display: flex;
		margin-bottom: 8px;
		
		.userLogo{
			width: 90rpx;
			height: 90rpx;
			margin-right: 22rpx;
			border-radius:  100%;
			border: 1px solid #ddd;
			overflow: hidden;
			
			.userLogoImage{
				width: 100%;
				font-size: 0;
			}
		}
		
		.userMessage{
			width: 580rpx;
			padding-bottom: 8px;
			border-bottom: 1px solid #f5f5f5;
			padding-right: 120rpx;
			box-sizing: border-box;
			position: relative;
			
			.userName{
				font-size: 26rpx;
				color: #000;
			}
			
			.userDesc{
				font-size: 22rpx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				line-height: 32rpx;
				height: 32rpx;
			}
			
			.userAchieve{
				font-size: 20rpx;
				color: #ddd;
			}
			
			
			.follow{
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				padding: 2px 8px;
				border-radius: 4px;
				border: 1px solid #3c9cff;
				color: #3c9cff;
				font-size: 20rpx;
				
				&.following{
					border-color: #999;
					color: #999;
				}
			}
		}

	}
</style>