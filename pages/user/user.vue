<template>
	<view class="userContent" :style="{'height' : windowHeight + 'px'}">
		<view class="userInfo"  :style="{'height' : '566rpx'}">
			<view v-if="userInfo">
				<view class="icon">
					<image :src="userInfo.avatar_url|imageUrlReset(200,80)" mode="aspectFill" class="iconImg"></image>
				</view>
				<view class="message">
					<view class="name">{{userInfo.nickname}}</view>
					<view class="uid">UID: {{userInfo.uid}}</view>
					<view class="type">{{userInfo.introduce}}</view>
				</view>
				<view class="ip">
					<u-icon name="map" color="#ddd" size="32" class="mapIcon"></u-icon>
					IP:{{userInfo.ip_region}}
				</view>
				<view class="achieve">
					<view class="followed flex pr30">
						<view class="number">
							{{userInfo.achieve.followed_cnt}}
						</view>粉丝</view>
					<view class="followimg flex pr30">
						<view class="number">
							{{userInfo.achieve.follow_cnt}}
						</view>关注</view>
					<view class="like flex">
						<view class="number">
							{{userInfo.achieve.like_num}}
						</view>获赞</view>
				</view>
			</view>
		</view>
		<scroll-view :scroll-x="true" :style="{'height' : '169rpx'}">
			<view class="gameList" v-if="gameCard">
				<view class="gameCard" v-for="(item,index) in gameCard" :key="index">
					<view class="gameDetail" :style="{'background': `url(${item.background_image_v2}) no-repeat top/100%`}">
						<view class="gameInfo">
							<image :src="fittlerImageSrc(item.game_id)" mode="widthFix" class="gameLogo"></image>
							<view class="level">
								<view class="name">{{item.nickname}}</view>
								<view class="gameLevel">
									{{item.region_name}} Lv.{{item.level}}
								</view>
							</view>
						</view>
						<view class="gamePlay">
							<view class="gamePlayData" v-for="(item2,index2) in item.data" :key="index2">
								<view class="number">
									{{item2.value}}
								</view>
								<view class="desc">
									{{item2.name}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="gameManage">
					<view class="gameManageSpan">
						角色管理
					</view>
				</view>
			</view>
		</scroll-view>
		
		<user-about :uid = "uid"></user-about>
	</view>
</template>

<script>
	import {getGameRecordCard,getUserFullInfo} from '../../common/api.js'
	import UserAbout from '../../components/user/userAbout.vue'
	export default {
		components: {
			UserAbout
		},
		data() {
			return {
				gameCard: null,
				uid: '19084220',
				userInfo: null
			}
		},
		methods: {
			async getUserInfo() {
				const {data: res} = await getUserFullInfo(this.uid)
				this.userInfo = res.data.user_info
				console.log(res,'info')
			},
			// getGameRecordCard 请求回来的数据为固定数据
			async getGameCard() {
				const {data: res} =await getGameRecordCard(this.uid)
				this.gameCard = res.data.list
				console.log(res,'game')
			},
			fittlerImageSrc(id) {
				if(id === 2) return '../../static/user/ys.png'
				if(id === 1) return '../../static/user/bh3.png'
				if(id === 6) return '../../static/user/sr.png'
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight
				}
			})
			this.getUserInfo()
			this.getGameCard()
		}
	}
</script>

<style lang="scss" scoped>
.userContent{
	background: url(../../static/user/bgimg.png) no-repeat top/100%;
	position: relative;
	
	.userInfo{
		padding: 60rpx 32rpx 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 26rpx;
		
		.flex{
			
		}
		
		.pr30{
			padding-right: 30px;
		}
		
		.icon{
			
			.iconImg{
				width: 160rpx;
				height: 160rpx;
				font-size: 0;
				border-radius: 160rpx;
			}
		}
		
		.message{
			padding-top: 20rpx;
			
			.name{
				padding-bottom: 22rpx;
				font-size: 48rpx;
				color: #ffffff;
				display: flex;
				align-items: center;
			}
			
			.type{
				padding: 18rpx 0 26rpx;
				font-size: 30rpx;
			}
		}
		
		.ip{
			padding: 8rpx 16rpx 8rpx 52rpx;
			border-radius: 8rpx;
			background-color: rgba(255, 255, 255, 0.2);
			color: #ddd;
			display: inline-block;
			position: relative;
			
			.mapIcon{
				position: absolute;
				left: 14rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		
		.achieve{
			padding: 30rpx 0;
			display: flex;
			align-items: center;
			
			
			.flex{
				vertical-align: bottom;
			}
			.number{
				color: #ffffff;
				padding-right: 5px;
				font-size: 44rpx;
				display: inline-block;
			}
		}
	}
	
	.gameList{
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		
		.gameCard{
			position: relative;
			margin-right:24rpx;
			
			.gameDetail{
				width: 500rpx;
				height: 169rpx;
				padding:10rpx 16rpx;
				border-radius: 24rpx;
				box-sizing: border-box;
				
				.gameInfo{
					display: flex;
					align-items: center;
					
					.gameLogo{
						width: 56rpx;
						height: 56rpx;
						border-radius: 10rpx;
					}
					
					.level{
						font-size: 26rpx;
						color: #fff;
						margin-left: 6px;
						
						.gameLevel{
							font-size: 20rpx;
							color: rgba(255, 255, 255, 0.4);
						}
					}
				}
				
				.gamePlay{
					display: flex;
					justify-content: space-between;
					font-size: 18rpx;
					color: rgba(255, 255, 255, 0.4);
					text-align: center;
					background-color: rgba(0, 0, 0, 0.3);
					margin-top: 16rpx;
					border-radius: 12rpx;
					padding:6rpx 16rpx ;
					
					.number{
						font-size: 24rpx;
						color: #eee;
					}
				}
			}
		}
		
		.gameManageSpan{
			width: 100rpx;
			height: 169rpx;
			font-size: 24rpx;
			color: #fff;
			padding:50rpx 22rpx;
			text-align: center;
			box-sizing: border-box;
			border-radius: 24rpx;
			background-color: rgb(0, 96, 178);
			margin-right: 32rpx;
		}
	}
	
}
</style>
