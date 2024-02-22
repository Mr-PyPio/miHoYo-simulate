<template>
	<view class="itemContent">
		<view class="userLogo">
			<image class="userLogoImage" :src="item.cover" mode="widthFix"></image>
		</view>
		<view class="userMessage">
			<view class="userName" v-html="matchText(item.name)">
			</view>
			<view class="userDesc">
				{{item.desc}}
			</view>
			<view class="userAchieve">
				{{item.stat.view|resetNum2}}浏览 / {{item.stat.discuss|resetNum2}}谈论
			</view>		
			<view class="follow" :class="{'following' : is_following}" @tap.stop="followUser(item.id)">
				{{followText}}
			</view>
		</view>

	</view>
</template>

<script>
	import {focus,unfocus} from '../../common/api.js'
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
				is_following: this.item.is_focus,
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
			async followUser(id) {
				if(!this.is_following) {
					const {data: res} = await focus({
						 "entity_id": id
					})
					if(res.message === 'OK'){
						this.is_following = true
					}
				}else{
					const {data: res} = await unfocus({
						 "entity_id": id
					})
					if(res.message === 'OK'){
						this.is_following = false
					}
				}
			},
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
			border-radius:  8px;
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
				font-weight: 600;
			}
			
			.userDesc{
				font-size: 22rpx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				line-height: 42rpx;
				height: 42rpx;
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