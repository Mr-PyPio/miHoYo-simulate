<template>
	<view class="content" >
		<view style="padding: 24rpx 24rpx 0;" @tap.stop="navigatePostReplay(item.post.post_id)">
			<view class="itemDetailTop">
				<view class="topLeft" @tap.stop="navigateToUser(item.user.uid)">
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
							
							<image :src="`https://bbs-static.miyoushe.com/level/level${item.user.level_exp.level}.png`"
								mode="heightFix" class="levelLogo">
							</image>
						</view>
					</view>
				</view>
				<view class="topRight">
					{{item.post.created_at|changeMonAndDay}}{{item.post.game_id|changeGameType}}
				</view>
			</view>
			<view class="itemDetailContent">
				<view class="itemDetailTextTitle" v-if="item.post.subject" >
					<view class="itemDetailTextTitleDetail" v-html="matchText(item.post.subject,1)"></view>
				</view>
				<view v-if="item.post.content" >
					<view class="itemDetailTextContent" v-html="matchText(item.post.content,2)"></view>
				</view>
				<item-content :item="item" ref="itemContent"></item-content>
			</view>
			<view class="itemDetailBottom">
				<view class="topicsName" v-if=" item.topics.length > 0">{{item.topics[0].name}}</view>
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
		name:"postItems",
		components: {
			ItemContent
		},
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
			matchText(text,type) {
				const reg = new RegExp(`${this.keyWord}`,'g')
				if(this.item.user.certification && this.item.user.certification.type === 1 && type === 1) {
					text = `<img class="logoImage" src="${imageBaseUrl}search/certificate01.png" style="width: 20px;height: 20px;font-size: 0;vertical-align: bottom;"/>${text}`
				}
				if(type === 2) {
					text = `${text}...`
				}
				
				return text.replace(reg, `<span style="color: #71e0fe">${this.keyWord}</span>`)
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
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth()+1
				const year = date.getFullYear()
				return `${year}-${createMon}-${createDay}`
			},
			changeGameType(value) {
				if(value === 2) {
					return ` · 原神`
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content{
		border-bottom: 6px solid #f8f8f8;
	}
.itemDetailTop{
	display: flex;
	justify-content: space-between;
	
	.topLeft{
		display: flex;
		align-items: center;
		height: 48rpx;
		padding: 12rpx;
		
		.userImage{
			width: 48rpx;
			height: 48rpx;
			position: relative;
			
			.userAvatarImage{
				width: 48rpx;
				height: 48rpx;
				border-radius: 48rpx;
			}
			
			.userAvatarFrameImage{
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				left: -6rpx;
				top: -6rpx;
			}
			
			.certificate{
				position: absolute;
				right: -2rpx;
				bottom: -2rpx;
				width: 16rpx;
				height: 16rpx;
			}
		}
		
		.userMessage{
			padding-left: 12rpx;
			
			.userName{
				font-size: 24rpx;
				color: #000;
				display: flex;
				align-items: center;
				
				.levelLogo{
					height: 24rpx;
					margin-left: 5px;
				}
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
		color: #ddd;
		font-size: 24rpx;
	}
}
.itemDetailContent{
	.itemDetailTextTitle{
		font-size: 28rpx;
		line-height: 1.5;
		padding: 8rpx 0;
		color: #000;
		
		.itemDetailTextTitleLogo{
			display: inline-block;
			width: 40rpx;
			height: 40rpx;
			margin-right: 2px;
			vertical-align: bottom;
			
			.logoImage{
				width: 40rpx;
				height: 40rpx;
				font-size: 0;
			}
		}
		
		.itemDetailTextTitleDetail{
			display: inline;
		}
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
	
	.itemDetailImage{
		position: relative;
		
		.imageList{
			font-size: 0;
			max-height: 460px;
			overflow: hidden;
			
			.image2{
				max-height: 346rpx;
				display: flex;
				justify-content: space-between;
				
				.showImage{
					width: 346rpx;
					height: 346rpx;
					border-radius: 8px;
					padding: 0 2rpx;
					box-sizing: border-box;
				}
			}
			.image1{
				position: relative;
				
				.showImage{
					display: inline-block;
					width: 460rpx;
				}
			}
			

			
			.moreImage{
				position: absolute;
				padding: 2px 4px 2px 20px;
				background-image: url("../../static/imgCopy.png");
				background-color: rgba(0, 0, 0, 0.5);
				background-size: 12px auto;
				background-position: 4px center;
				background-repeat: no-repeat;
				bottom: 6px;
				right: 6px;
				color: #fff;
				font-size: 20rpx;
				border-radius: 4px;
			}
		}	}

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