<template>
	<view class="itemDetailImage">
			<view v-if="item.image_list.length > 0 && !videoUrl" class="imageList" :class="'imageList'+ item.image_list[0].entity_id">
			
				<view v-if="item.image_list.length >= 2" class="image2">
					<view class="showImage" @tap.stop="showImage(0)" >
						<LazyImage :imageData="item.image_list[0]" :width="346 / rpxNum"></LazyImage>
					</view>
					<view class="showImage" @tap.stop="showImage(1)"  :width="346 / rpxNum">
						<LazyImage :imageData="item.image_list[1]" ></LazyImage>
					</view>
				</view>
				
				<view v-if="item.image_list.length < 2" class="image1">
					<view class="showImage" @tap.stop="showImage(0)" >
						<LazyImage :imageData="item.image_list[0]"  :width="460 / rpxNum"></LazyImage>
					</view>
				</view>
				<view class="moreImage" v-if="item.image_list.length > 2">
					{{item.image_list.length}}
				</view>
			</view>
			<view  v-if="videoUrl" class="vodieList" :style="{'width': videoWidth, 'height': videoHeight+'rpx'}">
				<video :src="videoUrl"  :id="'video'+ videoId"
					:autoplay="false" :muted="!videoMute" :ref="'video'+ videoId"
					object-fit="cover" :show-center-play-btn="false"  :show-fullscreen-btn="false"
					:poster="videoCover" :controls="false"  :show-mute-btn="false"
					:style="{'width': videoWidth, 'height': videoHeight +'rpx'}" :class="'videoDetail'+videoId" 
					@ended = "videoEnded"  @timeupdate="timeupdate"
					>
				</video>
				<view class="videoButton" v-if="!is_stop">
					<view class="muteBtn" @tap.stop="controlVideoMute">
						<u-icon name="volume" color="#ffffff" size="28" v-if="videoMute"></u-icon>
						<u-icon name="volume-off" color="#ffffff" size="28"  v-if="!videoMute"></u-icon>
					</view>
					<view class="pauseBtn" @tap.stop="controlVideoPause">
						<u-icon name="pause" color="#ffffff" size="28"></u-icon>
					</view>
					<view class="progress">
						<view class="progressLine" :style="{'width': viddeoPercentage + '%'}"></view>
					</view>
				</view>
				
				<view class="videoStep">
					{{videoStep}}
				</view>
				
				 <view class="videoWrapp" v-if="is_stop" @tap.stop="videoStart(videoId)"></view>
				 
				 <view class="videoEndedWrap" v-if="videoEnd && item.user">
				 	<view class="videoEndedWraper">
				 		<view class="userImage" @tap.stop="entryUserHome(item.user.uid)">
				 			<image :src="item.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage" :lazy-load="true"></image>
				 			<image :src="item.user.pendant|imageUrlReset(50,80)" :lazy-load="true" mode="aspectFill" class="userAvatarFrameImage" v-if="item.user.pendant"></image>
				 		</view>
				 		<view class="userName">
				 			{{item.user.nickname}}
				 		</view>
				 		<view class="follow" @tap.stop="followUser(item.user.uid)">
				 			+ 关注
				 		</view>
				 		<view class="replayVideo" @tap.stop="replayVideo">
				 			<image src="../../static/replay.png" mode="aspectFill" class="image"></image>
				 			重播
				 		</view>
				 	</view>
				 </view>
			</view>
		</view>
	</view>
</template>

<script>
		import {mapState,mapMutations} from 'vuex'
		import LazyImage from '@/components/common/lazyImage.vue'
	export default {
		components: {
			LazyImage
		},
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			},
		},
		data() {
			return {
				videoEnd: false,
				is_stop: true,
				videoStep: 0,
				viddeoPercentage: 0,
				videoWidth: '100%',
				videoHeight: 500,
				videoId: null,
				intervalTimer: null,
				intersectionObserverVideo: null,
				videoUrl: ''
			}
		},
		computed: {
			...mapState(['videoMute','windowHeight','rpxNum']),
		},
		methods: {
			...mapMutations(['updateVideoMute','updateImageData']),
			showImage(index) {
				const listData = this.item.image_list
				this.updateImageData({
					show: true,
					list: listData,
					showIndex: index
				})
				// #ifdef MP-WEIXIN
					wx.hideTabBar()
				// #endif
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
			videoStart(type) {
				const ref = 'video' + this.videoId
				this.is_stop = false
				let videoContext
				// #ifdef MP-WEIXIN
				videoContext = uni.createVideoContext(ref,this)
				// #endif
				// #ifndef MP-WEIXIN
				videoContext = this.$refs[ref]
				// #endif
				if(videoContext) {
					if(type === 'replay') {
						this.videoEnd = false
						videoContext.pause()
						videoContext.currentTime = 0	
						videoContext.play()
					}else{
						this.videoEnd = false
						videoContext.play()
					}
					this.addListen()
				}
			},
			replayVideo() {
				this.videoStart('replay')
			},
			videoEnded() {
				this.videoEnd = true
			},
			videoStop() {
				const id = this.videoId
				if(!this.is_stop) {
					const ref = 'video' + this.videoId
					this.is_stop = true
					// #ifdef MP-WEIXIN
					const videoContext = uni.createVideoContext(ref,this)
					videoContext.pause();
					// #endif
					// #ifndef MP-WEIXIN
					this.$refs[ref].pause()
					// #endif
				}
			},
			controlVideoMute() {
				const oldVideoMute = this.videoMute
				this.updateVideoMute(!oldVideoMute)
			},
			
			controlVideoPause() {
				this.videoStop()
				this.intersectionObserverVideo.disconnect()
			},
			
			resetWH() {
				this.videoEnd=false
				this.is_stop=true
				this.videoStep=0
				this.videoId = null
				if(this.item.vod_list.length) {
					const video = this.item.vod_list[0]
					let resolutions
					if(video.resolutions.length > 1) {
						resolutions = video.resolutions[video.resolutions.length - 1]
					}else{
						resolutions = video.resolutions[0]
					}
					this.videoCover = video.cover
					this.videoUrl = resolutions.url
					const width = resolutions.width
					const height = resolutions.height
					const per = width / height
					if(per > 1) {
						this.videoHeight = 702 * height / width
					}else{
						this.videoWidth = '400rpx'
						this.videoHeight = 400 * height / width
					}
					this.videoId = video.id
					const time = Number(video.duration)
					this.videoStep = this.getStep(time)
				}else if(this.item.image_list.length){
					this.imageId = this.item.image_list[0].entity_id
				}
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
			controlVideoMute() {
				const oldVideoMute = this.videoMute
				this.updateVideoMute(!oldVideoMute)
			},
			
			timeupdate(e) {
				const currentTime = e.detail.currentTime
				const durationTime = e.detail.duration
				this.currentTime = currentTime
				this.durationTime = durationTime
				this.viddeoPercentage = (currentTime + 1) / durationTime * 100
				const num = durationTime - currentTime
				const m = parseInt(num / 60) >=10 ? parseInt(num / 60) : '0' + parseInt(num / 60)
				const s = parseInt(num % 60) >=10 ? parseInt(num % 60) : '0' + parseInt(num % 60)
				this.videoStep = `${m}:${s}`
			},
			entryUserHome(userId) {
				uni.$emit('navPage','user',uid)
			},
			addListen() {
				this.intersectionObserverVideo = uni.createIntersectionObserver(this);
				const top = this.windowHeight / 2 - 30
				this.intersectionObserverVideo.relativeToViewport({bottom:-300,top:-top,left:0,right: 0}).observe(`.videoDetail${this.videoId}`, (res) => {
				  if (res.intersectionRatio <= 0) {
					this.videoStop()
					this.intersectionObserverVideo.disconnect()
				  }
				});
			},
		},
		created() {
			this.resetWH()
		}
	}
</script>

<style lang="scss" scoped>
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
		}
		
		.vodieList{
			border-radius: 4px;
			overflow: hidden;
			position: relative;
			
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
				position: absolute;
				bottom: 0;
				left: 0;
				height: 30px;
				width: 100%;
				align-items: center;
				box-sizing: border-box;
				
				.muteBtn,.pauseBtn{
					width: 24px;
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
					width:70%;
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
			}
		}
	
	}
	
</style>