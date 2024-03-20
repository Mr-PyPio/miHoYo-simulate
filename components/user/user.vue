<template>
	<scroll-view :scroll-y="true" :style="{'height': '100%'}" @scroll="scroll">
		<view class="userContentWrap">
			<view class="userContent" :style="bigImage" v-if="!loading">
				<view class="userInfo" >
					<view v-if="userInfo">
						<view class="fixedTop" :style="{'background': fixedTopBgColor,'position':fixedTopType}">
							<view class="fixedLeft" >
								<u-icon name="arrow-left" color="#fff" size="40" class="turnBack" @tap="turnBack"></u-icon>
								<view v-if="fixedTopLogoShow" class="imageMessage">
									<image :src="userInfo.avatar_url|imageUrlReset(200,80)" mode="aspectFill" class="fixedTopLogo"></image>
									{{userInfo.nickname}}
								</view>
							</view>
							<view class="fixedRight">
								<image src="../../static/user_set.png" mode="widthFix" class="set"></image>
							</view>
						</view>
						<view class="userImage">
							<image :src="userInfo.avatar_url|imageUrlReset(200,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
							<image :src="userInfo.pendant|imageUrlReset(200,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="userInfo.pendant"></image>
							<image v-if="userInfo.certification && userInfo.certification.type"
								:src="`${imageBaseUrl}poseRequlay/certificate${userInfo.certification.type}.png`" mode="widthFix" class="certificate">
							</image>
						</view>
						<view class="message">
							<view class="name">{{userInfo.nickname}}</view>
							<view class="type">{{userInfo.introduce}}</view>
						</view>
						<view class="certifi">
							<view class="gender certifiType" v-if="userInfo.gender">
								<view class="icon">
									<u-icon name="woman" color="#ddd" size="22"></u-icon>
								</view>
								{{userInfo.gender|resetGender}}
							</view>
							<view class="ip certifiType" v-if="userInfo.ip_region">
								<view class="icon">
									<u-icon name="map" color="#ddd" size="24"></u-icon>
								</view>
								IP:{{userInfo.ip_region}}
							</view>
							<view class="certifiType" v-if="userInfo.certification && userInfo.certification.type">
								<image :src="`${imageBaseUrl}poseRequlay/certificate${userInfo.certification.type}.png`" mode="widthFix" class="icon"></image>
								{{userInfo.certification.label}}
							</view>
						</view>
						<view class="achieve">
							<view class="followed flex pr30">
								<view class="number">
									{{userInfo.achieve.followed_cnt|resetNum2}}
								</view>粉丝</view>
							<view class="followimg flex pr30">
								<view class="number">
									{{userInfo.achieve.follow_cnt|resetNum2}}
								</view>关注</view>
							<view class="like flex">
								<view class="number">
									{{userInfo.achieve.like_num|resetNum2}}
								</view>获赞</view>
						</view>
					</view>
				</view>
				<scroll-view :scroll-x="true" :style="{'height' : '169rpx','margin-top': '20rpx'}"  v-if="gameCard && gameCard.length">
					<view class="gameList">
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
					</view>
				</scroll-view>
				
				<user-about v-if="uid" :uid = "uid" :showCategoryMode="false"></user-about>
				
				<img-pop-up></img-pop-up>
				
			</view>
			<image src="http://8.138.116.67:5230/miyoushe/search/loading1.gif" mode="aspectFit" class="loading" v-if="loading"></image>
		</view>
	</scroll-view>
</template>

<script>
	import {mapState} from 'vuex'
	import UserPopup from '../../components/user/userPopup.vue'
	import {getGameRecordCard,getUserFullInfo} from '../../common/api.js'
	import UserAbout from '../../components/user/userAbout.vue'
	import ImgPopUp from '@/components/common/imgPopUp.vue'
	export default {
		components: {
			UserAbout,
			UserPopup,
			ImgPopUp
		},
		props: {
			uid:{
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				gameCard: null,
				userInfo: null,
				fixedTopBgColor: 'rgba(0, 0, 0, 0.0)',
				fixedTopLogoShow: false,
				fixedTopType: 'absolute',
				imgFixWrappShow: false,
				imgList: [],
				imgShowIndex: 0,
				loading: true
			} 
		},
		computed: {
			...mapState(['windowHeight','rpxNum','imageBaseUrl']),
			bigImage() {
				return  `background: url('${this.imageBaseUrl}user/bgimg.png') no-repeat top/100%;`
			}
		},
		created() {
			this.getUserInfo()
			this.getGameCard()
		},
		methods: {
			async getUserInfo() {
				const {data: res} = await getUserFullInfo(this.uid)
				this.userInfo = res.data.user_info
				this.loading = false
			},
			// getGameRecordCard 请求回来的数据为固定数据
			async getGameCard() {
				const {data: res} =await getGameRecordCard(this.uid)
				this.gameCard = res.data.list
			},
			fittlerImageSrc(id) {
				if(id === 2) return this.imageBaseUrl + 'user/ys.png'
				if(id === 1) return this.imageBaseUrl + 'user/bh3.png'
				if(id === 6) return this.imageBaseUrl + 'user/sr.png'
			},
			openMeun() {
				this.$nextTick(function() {
					this.$refs.userPopup.show = true
				})
			},
			turnBack() {
				// uni.navigateBack()
				this.fixedTopType = 'absolute'
				uni.$emit('navGoBack','user')
			},
			scroll(e) {
				const top = e.detail.scrollTop
				this.fixedTopType = 'fixed'
				if(top > 200) {
					this.fixedTopBgColor = '#004887'
					this.fixedTopLogoShow = true
				}else{
					this.fixedTopBgColor = 'rgba(0, 0, 0, 0.0)'
					this.fixedTopLogoShow = false
				}
			},
		},
		filters: {
			resetGender(gender) {
				if(gender === 2) {
					return '女'
				}else if(gender === 1) {
					return '男'
				}
			}
		}
}
</script>

<style lang="scss" scoped>
.userContentWrap{
	position: relative;
	width: 100%;
	height: 100%;
	background: #fff;
	
	.loading{
		width: 400rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 10;
	}
}
.userContent{
	position: relative;
	// #ifdef MP-WEIXIN
	padding-top: 80rpx;
	// #endif
	
	.userInfo{
		padding: 100rpx 32rpx 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 20rpx;
		
		.fixedTop{
			left: 0;
			top: 0;
			width: 750rpx;
			height: 80rpx;
			z-index: 10;
			display: flex;
			align-items: center;
			// #ifdef MP-WEIXIN
			height: 170rpx;
			box-sizing: border-box;
			padding-top: 90rpx;
			// #endif
			
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
				
				.imageMessage{
					display: flex;
					align-items: center;
					margin-left: 20rpx;
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
		.userImage{
			width: 140rpx;
			height: 140rpx;
			position: relative;
			
			.userAvatarImage{
				width: 140rpx;
				height: 140rpx;
				border-radius: 140rpx;
				background-color: #fff;
			}
			
			.userAvatarFrameImage{
				width: 186rpx;
				height: 186rpx;
				position: absolute;
				left: -23rpx;
				top: -23rpx;
			}
			
			
			
			.certificate{
				position: absolute;
				right: -2rpx;
				bottom: -2rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.message{
			padding-top: 40rpx;
			
			.name{
				font-size: 32rpx;
				color: #ffffff;
				display: flex;
				align-items: center;
			}
			
			.type{
				width: 375rpx;
				padding: 18rpx 0;
				font-size: 22rpx;
			}
		}
		.certifi{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			max-width: 375rpx;
			
			.certifiType{
				padding: 4rpx 10rpx 4rpx 36rpx;
				border-radius: 8rpx;
				background-color: rgba(255, 255, 255, 0.2);
				color: #ddd;
				display: inline-block;
				position: relative;
				margin-right: 8rpx;
				max-width: 350rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-top: 8rpx;
				
				.icon{
					position: absolute;
					left: 8rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
		
		.achieve{
			padding-top: 30rpx;
			display: flex;
			align-items: center;
			
			
			.flex{
				vertical-align: bottom;
			}
			.number{
				color: #ffffff;
				padding-right: 5px;
				font-size: 26rpx;
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