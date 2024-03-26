<template>
	<view class="vodieList" :class="{'fixed': video.initEnd}" v-if="video.videoUrl" :style="{'height': video.videoHeight +'px','top': video.top}">
		<view class="videoBackgroung">
			<video :src="video.videoUrl"  :id="'video'+ video.videoId" :class="'videoDetail'+video.videoId"  :ref="'video'+ video.videoId"
				:autoplay="true" :muted="video.videoMute" :initial-time="video.currentTime" :loop="false"
				object-fit="cover" :show-center-play-btn="false"  :show-fullscreen-btn="false"
				:poster="video.cover" :controls="false"  :show-mute-btn="false"
				:style="{'width': video.videoWidth +'px', 'height': video.videoHeight +'px'}" 
				@ended = "videoEnded"  @timeupdate="timeupdate"
				>
			</video>
		</view>
		<view class="videoButton" v-if="!video.is_stop">
			<view class="muteBtn" @tap="controlVideoMute">
				<u-icon name="volume" color="#ffffff" size="28" v-if="!video.videoMute"></u-icon>
				<u-icon name="volume-off" color="#ffffff" size="28"  v-if="video.videoMute"></u-icon>
			</view>
			<view class="progress">
				<view class="progressLine" :style="{'width': video.viddeoPercentage + '%'}"></view>
			</view>
		</view>
		
		<view class="videoStep" v-if="video.videoStep">
			{{video.videoStep}}
		</view>
		
		 <view class="videoWrapp" v-if="video.is_stop" @tap="videoStart(video.id)"></view>
		 
		 <view class="videoEndedWrap" v-if="video.videoEnd && userData">
		 	<view class="videoEndedWraper"  v-if="!is_following">
		 		<view class="userImage" @tap.stop="entryUserHome(userData.uid)">
		 			<image :src="userData.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
		 			<image :src="userData.pendant|imageUrlReset(50,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="userData.pendant"></image> 
		 		</view>
		 		<view class="userName">
		 			{{userData.nickname}}
		 		</view>
		 		<view class="follow" @tap.stop="followUser(userData.uid)">
		 			+ 关注
		 		</view>
		 		<view class="replayVideo" @tap.stop="replayVideo">
		 			<image src="../../static/replay.png" mode="aspectFill" class="image"></image>
		 			重播
		 		</view>
		 	</view>
			
			<view class="is_following" v-if="is_following" @tap.stop="replayVideo">
				<image class="mhy-video-player-svg-icon" src="../../static/videoReply.png" mode="widthFix" ></image>
				<view class="">
					重新播放
				</view>
			</view>
		 </view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		props: {
			videoData:{
				type: Object,
				default() {
					return {}
				}
			},
			userData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				video: {
					videoUrl : this.videoData.src,
					is_stop: false,
					videoStep: '',
					viddeoPercentage: 0,
					videoWidth: 750,
					videoHeight: 500,
					videoId: this.videoData.detail.id,
					videoEnd: false,
					videoMute: true,
					currentTime: 0,
					cover: this.videoData.detail.cover,
					aspectRatio:0,
					initHeight: 0,
					initEnd: false,
					heightIsChange: false,
					miniHeight: 300,
					top: 0
				}, 
				is_following: this.userData.is_following,
			}
		},
		computed: {
			...mapState(['windowHeight','rpxNum','windowWidth'])
		},
		created() {
			const currentTime =  this.videoData.currentTime
			const durationTime =   this.videoData.durationTime
			if(durationTime != currentTime) {
				this.video.currentTime = currentTime
			}
			// #ifdef MP-WEIXIN
			this.video.top = '170rpx'
			// #endif
			this.resetWH()
		},
		methods: {
			videoStart(type) {
				this.$nextTick(function () {
					const ref = 'video' + this.video.videoId
					this.video.is_stop = false
					let videoContext
					// #ifdef MP-WEIXIN
					videoContext = uni.createVideoContext(ref,this)
					// #endif
					// #ifndef MP-WEIXIN
					videoContext = this.$refs[ref]
					// #endif
					if(type === 'replay') {
						this.video.videoEnd = false
						videoContext.pause()
						videoContext.currentTime = 0	
						videoContext.play()
					}else{
						this.video.videoEnd = false
						videoContext.play()
					}
				})
			},		
			videoStop() {
				this.$nextTick(function () {
					if(!this.video.is_stop) {
						const ref = 'video' + this.video.videoId
						this.video.is_stop = true
						// #ifdef MP-WEIXIN
						const videoContext = uni.createVideoContext(ref,this)
						videoContext.pause();
						// #endif
						// #ifndef MP-WEIXIN
						this.$refs[ref].pause()
						// #endif
					}
				})
			
			},
			getStep(time) {
				if(time >= 60000) {
					const M = parseInt(time / 60000) >= 10 ? parseInt(time / 60000): '0'+ parseInt(time / 60000)
					const S = parseInt(time % 60000 / 1000) >= 10 ? parseInt(time % 60000 / 1000): '0' + parseInt(time % 60000 / 1000)
					return `${M}:${S}`
				}else{
					const S = parseInt(time / 1000) >= 10 ? parseInt(time / 1000): '0' + parseInt(time / 1000)
					return  `00:${S}`
				}
			},
			resetWH() {
				if(this.video.videoUrl) {
					const video = this.videoData.detail
					let resolutions
					if(video.resolutions.length > 1) {
						resolutions = video.resolutions[video.resolutions.length - 1]
					}else{
						resolutions = video.resolutions[0]
					}
					this.video.aspectRatio = resolutions.width / resolutions.height
					const InitHeight = this.windowWidth / this.video.aspectRatio
					const MaxHeight = parseInt(this.windowHeight * 0.6)
					if(InitHeight > MaxHeight) {
						this.video.videoHeight = MaxHeight
						this.video.videoWidth = this.video.videoHeight * this.video.aspectRatio
					}else{
						this.video.videoHeight = InitHeight
					}
					this.video.initHeight = this.video.videoHeight
					if(this.video.initHeight >= this.video.miniHeight) {
						this.video.heightIsChange = true
					}
					this.video.videoId = video.id
					this.video.initEnd = true
					this.$emit('setHiddenContainerStyle',this.video.videoHeight)
				}
			},
			videoEnded() {
				this.video.videoEnd = true
				this.video.viddeoPercentage = 0
			},
			againVideoPlay() {
				this.video.videoEnd = false
				this.videoStart()
			},
			timeupdate(e) {
				const currentTime = e.detail.currentTime
				const durationTime = e.detail.duration
				this.video.viddeoPercentage = (currentTime + 1) / durationTime * 100
				const num = durationTime - currentTime
				const m = parseInt(num / 60) >=10 ? parseInt(num / 60) : '0' + parseInt(num / 60)
				const s = parseInt(num % 60) >=10 ? parseInt(num % 60) : '0' + parseInt(num % 60)
				this.video.videoStep = `${m}:${s}`
			},
			replayVideo() {
				this.videoStart('replay')
			},
			controlVideoMute() {
				this.video.videoMute = !this.video.videoMute
			},
			followUser(userId) {
				this.$emit('followUser',userId)
			},
			entryUserHome(userId) {
				uni.$emit('navPage','user',userId)
			},
			scrollHeightChange(top) {
				let change = false
				if(top < this.oldScrollTop){
					change = true
				}else{
					change = false
				}
				this.oldScrollTop = top
				if(this.video.videoHeight > this.video.miniHeight || change) {
					this.video.videoHeight = this.video.initHeight - top 
					this.video.videoWidth = this.video.videoHeight * this.video.aspectRatio
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.vodieList{
		overflow: hidden;
		position: relative;
		width: 750rpx;
		
		&.fixed{
			position: absolute;
			left: 0;
			z-index: 100;
		}
		
		.videoBackgroung{
			width: 100%;
			height: 100%;
			background: #000;
			display: flex;
			justify-content: center;
		}
		
		.videoWrapp{
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: rgba(0, 0, 0, 0.5);
			top: 0;
			left: 0;
			background-image: url("../../static/videoIcon.png");
			background-size: 72rpx 72rpx;
			background-position: center center;
			background-repeat: no-repeat;
		}
		
		.videoButton{
			display: flex;
			justify-content: space-between;
			position: absolute;
			bottom: 0;
			left: 0;
			height: 30px;
			width: 100%;
			align-items: center;
			box-sizing: border-box;
			
			.muteBtn{
				width: 30px;
				height: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.progress{
				bottom: 0;
				left: 0;
				position: absolute;
				width: 100%;
				height: 3px;
				background: rgba(255,255,255,0.5);
				
				.progressLine{
					background: #3c9cff;
					transition-duration: 500ms;
					height: 3px;
					border-radius: 3px;
				}
			}
		}
		
		.videoStep{
			position: absolute;
			right: 8rpx;
			bottom: 8rpx;
			font-size: 20rpx;
			color: #fff;
			padding:2px 5px;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 4px;
		}
		
		.videoEndedWrap{
			position: absolute;
			left: 0;
			top:0;
			text-align: center;
			width: 100%;
			height: 100%;
			background: #000;
			
			.videoEndedWraper{
				position: absolute;
				left: 50%;
				top:50%;
				transform: translate(-50%,-50%);
				width: 400rpx;
			}
			
			.userImage{
				width: 72rpx;
				height: 72rpx;
				position: relative;
				margin: 0 auto;
				
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
			}
			
			.userName{
				color: #fff;
				font-size: 24rpx;
				padding-bottom: 4px;
				margin-top: 6px;
			}
			
			.follow{
				height: 24px;
				line-height: 24px;
				width: 70px;
				border-radius: 4px;
				background: #3c9cff;
				color: #fff;
				text-align: center;
				font-size: 20rpx;
				margin: 0 auto;
				margin-bottom: 4px;
			}
			.replayVideo{
				display: flex;
				justify-content: center;
				color: #ddd;
				font-size: 20rpx;
				align-items: center;
				width: 70px;
				margin: 0 auto;
				
				.image{
					width: 12px;
					height: 12px;
					margin-right: 3px;
				}
			}
			
			.is_following{
				width: 100rpx;
				background: #000;
				text-align: center;
				font-size: 24rpx;
				color: #fff;
				padding-top: 8px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				
				.mhy-video-player-svg-icon{
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
	
	
</style>