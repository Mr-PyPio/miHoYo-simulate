<template>
	<scroll-view scroll-y="true" :style="{'height' : scrollHeight}" @scroll="pageScroll">
		<view class="userContent" :style="bigImage">
			<view class="userInfo">
				<view v-if="userInfo">
					<view class="fixedTop" :style="{'background': fixedTopBgColor}">
						<view class="fixedLeft" v-if="fixedTopLogoShow">
							<image :src="userInfo.avatar_url|imageUrlReset(200,80)" mode="aspectFill" class="fixedTopLogo"></image>
							{{userInfo.nickname}}
						</view>
						<view class="fixedRight">
							<image src="../../static/set_icon.png" mode="widthFix" class="set"></image>
							<image src="../../static/meun_icon.png" mode="widthFix" class="meun" @tap.stop="openMeun"></image>
						</view>
					</view>
					<view class="icon">
						<image :src="userInfo.avatar_url|imageUrlReset(200,80)" mode="aspectFill" class="iconImg"></image>
					</view>
					<view class="message">
						<view class="name">{{userInfo.nickname}}</view>
						<view class="uid">UID: {{userInfo.uid}}</view>
						<view class="type">{{userInfo.introduce}}</view>
					</view>
					<view class="ip">
						<view class="mapIcon">
							<u-icon name="map" color="#ddd" size="32"></u-icon>
						</view>
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
					</view>·
				</view>
			</scroll-view>
			
			<user-about :uid = "uid" ></user-about>
			
			<user-popup :uid = "uid" ref="userPopup"></user-popup>
			
			<img-pop-up ></img-pop-up>
			
			<ListenOtherModul></ListenOtherModul>
		</view>
	</scroll-view>
</template>

<script>
	import {mapMutations,mapState} from "vuex"
	import {getGameRecordCard,getUserFullInfo} from '../../common/api.js'
	import UserAbout from '../../components/user/userAbout.vue'
	import ImgPopUp from '@/components/common/imgPopUp.vue'
	import UserPopup from '../../components/user/userPopup.vue'
	import ListenOtherModul from '@/components/index/listenOtherModul.vue'
	export default {
		components: {
			UserAbout,
			UserPopup,
			ImgPopUp,
			ListenOtherModul
		},
		data() {
			return {
				gameCard: null,
				uid: '19084220',
				userInfo: null,
				fixedTopBgColor: 'rgba(0, 0, 0, 0.0)',
				fixedTopLogoShow: false,
			}
		},
		computed: {
			...mapState(['myselfData','imageBaseUrl','windowHeight','rpxNum']),
			bigImage() {
				return  `background: url('${this.imageBaseUrl}user/bgimg.png') no-repeat top/100%;`
			},
			scrollHeight() {
				// #ifdef MP-WEIXIN
				return this.windowHeight + 'px'
				// #endif
				return this.windowHeight - 50 + 'px'
			}
		},
		methods: {
			...mapMutations(['updateMyselfData']),
			async getUserInfo() {
				const {data: res} = await getUserFullInfo(this.uid)
				this.userInfo = res.data.user_info
				this.updateMyselfData({
					name: 'userInfo',
					data: this.userInfo
				})
			},
			// getGameRecordCard 请求回来的数据为固定数据
			async getGameCard() {
				const {data: res} =await getGameRecordCard(this.uid)
				this.gameCard = res.data.list
				this.updateMyselfData({
					name: 'gameCard',
					data: this.gameCard
				})
			},
			fittlerImageSrc(id) {
				if(id === 2) return this.imageBaseUrl + 'user/ys.png'
				if(id === 1) return this.imageBaseUrl + 'user/bh3.png'
				if(id === 6) return this.imageBaseUrl + 'user/sr.png'
				if(id === 3) return this.imageBaseUrl + 'user/bh2.png'
				if(id === 4) return this.imageBaseUrl + 'user/wd.png'
				if(id === 8) return this.imageBaseUrl + 'user/zzz.png'
			},
			openMeun() {
				this.$nextTick(function() {
					this.$refs.userPopup.show = true
				})
			},
			pageScroll(e){
				const top = e.detail.scrollTop
				if(top > 200) {
					this.fixedTopBgColor = '#004887'
					this.fixedTopLogoShow = true
				}else{
					this.fixedTopBgColor = 'rgba(0, 0, 0, 0.0)'
					this.fixedTopLogoShow = false
				}
			}
		},
		onLoad() {
			if(this.myselfData.userInfo) {
				this.userInfo = this.myselfData.userInfo
			}else{
				this.getUserInfo()
			}
			if(this.myselfData.gameCard) {
				this.gameCard = this.myselfData.gameCard
			}else{
				this.getGameCard()
			}
		},
}
</script>

<style lang="scss" scoped>
.userContent{
	position: relative;
	
	.userInfo{
		padding: 100rpx 32rpx 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 24rpx;
		
		/* #ifdef MP-WEIXIN */
		padding-top: 270rpx;
		/* #endif */
		
		.fixedTop{
			position: fixed;
			left: 0;
			top: 0;
			width: 750rpx;
			height: 80rpx;
			z-index: 10;
			display: flex;
			align-items: center;
			/* #ifdef MP-WEIXIN */
			padding-top: 90rpx;
			/* #endif */
			
			
			.fixedLeft{
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #fff;
				padding: 0 32rpx;
				
				.fixedTopLogo{
					width: 50rpx;
					height: 50rpx;
					border-radius: 50rpx;
					border: 1px solid #fff;
					margin-right: 6px;
				}
				
				
			}
			
			.fixedRight{
				position: absolute;
				right: 32rpx;
				top: 50%;
				transform: translateY(-50%);
				display: flex;
				align-items: center;
				/* #ifdef MP-WEIXIN */
				padding-top: 90rpx;
				margin-right: 200rpx;
				/* #endif */
				
				.meun{
					width: 40rpx;
					height: 40rpx;
					margin-left: 30rpx;
				}
				.set{
					width: 40rpx;
					height: 40rpx;
				}
			}
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
				font-size: 32rpx;
				color: #ffffff;
				display: flex;
				align-items: center;
			}
			
			.type{
				width: 375rpx;
				padding: 18rpx 0 26rpx;
				font-size: 24rpx;
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
				font-size: 32rpx;
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
