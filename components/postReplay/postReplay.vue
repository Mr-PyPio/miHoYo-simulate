<template>
	<view class="postReplayContent" >
		<view class="videoWrapper" :style="{'top': videoTop}">
			<view class="videoBackgroung" 
				:style="{'width': dataInitWidth + 'rpx','height': dataInitHeight + 'px'}"
				:data-initheight="dataInitHeight" :data-aspectratio="dataAspectRatio">
				<video-full :videoData="defaultVideoData" :userData="userData" v-if="defaultVideoData" class="videoFull"
						@followUser="followUser" @setHiddenContainerStyle="setHiddenContainerStyle" ref="videoFullRef">
				</video-full>
			</view>
		</view>
		
		<view class="reviewsTop fixed reviewsTopFixed">
			<view class="topLeft" @tap.stop="showSort($event,'left')">
				{{reviewsTop.leftText}}
				<u-icon name="arrow-down-fill" color="#222" size="18" style="margin-left: 3px;"></u-icon>
			</view>
			<view class="topRight" @tap.stop="showSort($event,'right')" v-show="reviewsTop.rightTop">
				{{reviewsTop.rightText}}
				<image src="../../static/screen.png" mode="heightFix" class="image"></image>
			</view>
		</view>
		
		<view class="topTitleTab" @tap.stop="goBack">
			<view class="goBack" @tap="test.init">
				<u-icon name="arrow-left" color="#FFFFFF" size="36"></u-icon>
			</view>
		</view>
		
		
		<scroll-view :scroll-y="scrollY" :style="{'height': scrollWrapHeight}" :scroll-top="scrollTop"
			@scroll="test.pageScroll" @scrolltolower="scrolltolower" :refresher-enabled="true" :show-scrollbar="true"
			:refresher-triggered="refresherTrg"  @refresherpulling="scrollPull" :scroll-with-animation='true'
		>
			<view :style="{'height': hiddenContainerHeight + 'px','width': '750rpx','position':'relative'}" v-if="hiddenContainerHeight">
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="loadingGif" style="height: 40px;">
					<u-loading-icon mode="circle" size="42"></u-loading-icon>
				</view>
				<!-- #endif -->
				<!-- #ifdef WEB -->
				<image :src="imageBaseUrl + 'poseRequlay/loading.gif'" mode="heightFix" class="loadingGif">
				</image>
				<!-- #endif -->
			</view>
			<view class="postContent" v-if="postDetail">
				<view class="postContentCenterWrap">
					<view class="postSubject">
						<view class="left">
							{{postDetail.post.subject}}
						</view>
						<view @tap.stop="showSubjectDetail">
							<view class="right" @tap="test.moveScroll">
								<u-icon name="arrow-down" color="#aaa" size="32"></u-icon>
							</view>
						</view>
					</view>
					<view class="postTip">
						{{postDetail.post.created_at|changeMonAndDay}}
						{{postTip}}
					</view>
					<view class="postTip2" v-if="postDetail.topics.length">
						<view class="postTipitem" v-for="(item,index) in postDetail.topics" :key="index">
							{{item.name}}
						</view>
					</view>
					<view class="interaction">
						<view class="interactionItems"  @tap.stop="interactionClick(item.upvote_type)" 
						:class="{'active': choose_upvote_type === index + 1}"
						v-for="(item,index) in statObject" :key="index">
							<view class="imagLogo">
								<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_'+ (index + 1) +'.png'" mode="heightFix" class="image"></image>
							</view>
							<view class="num">
								{{item.upvote_cnt|resetNum}}
							</view>
						</view>
					</view>
					
					<view class="userMessageWrap" v-if="userData" @tap.stop="navigateToUser(userData.uid)">
						<view class="userImage">
							<image :src="userData.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage"></image>
							<image :src="userData.pendant|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarFrameImage" v-if="userData.pendant"></image>
								<image v-if="userData.certification && userData.certification.type"
								:src="`${imageBaseUrl}poseRequlay/certificate${userData.certification.type}.png`" mode="widthFix" class="certificate">
							</image>
						</view>
						<view class="userMessage">
							<view class="userName">
								{{userData.nickname}}
								<image :src="`https://bbs-static.miyoushe.com/level/level${userData.level_exp.level}.png`" 
									mode="heightFix" class="levelLogo">
								</image>
							</view>
							<view class="userLabel">
								{{userData|getUserLabel}}
							</view>
						</view>
						
						
						<view class="follow" @tap.stop="followUser(userData.uid)" v-if="!is_following">
							+ 关注
						</view>
						<view class="follow unfollow" @tap.stop="followUser(userData.uid)" v-if="is_following">
							已关注
						</view>
					</view>
				</view>
				
				<view class="reviews">
					<view style="width: 750rpx;height: 74rpx;" class="reviewsTopRef">
						<view class="reviewsTop">
							<view class="topLeft" @tap.stop="showSort($event,'left')">
								{{reviewsTop.leftText}}
								<u-icon name="arrow-down-fill" color="#222" size="18" style="margin-left: 3px;"></u-icon>
							</view>
							<view class="topRight" @tap.stop="showSort($event,'right')" v-show="reviewsTop.rightTop">
								{{reviewsTop.rightText}}
								<image src="../../static/screen.png" mode="heightFix" class="image"></image>
							</view>
						</view>
					</view>
					
					<reviews-list v-if="post_id && reviewLoading" :post_id="post_id" ref="reviewsListRef"> </reviews-list>
				</view>
			</view>
		</scroll-view>
		
			
		<view v-show="reviewsTop.show" @click.stop="fixWrappClick" >
			<view class="fixWrapp"  @tap="test.moveScroll">
				<view class="Warp" v-show="reviewsTop.leftWarp" :style="{'top':`${reviewsTop.sortListTop}px`,'left': `${reviewsTop.sortListLeft}px`}">
					<view class="warpItem" :class="{'active' : reviewsTop.leftType === 0}" @tap="typeSelectLeft(0)">
						全部评论
					</view>
					<view class="warpItem" :class="{'active' : reviewsTop.leftType === 1}"  @tap="typeSelectLeft(1)">
						只看楼主
					</view>
				</view>
				<view class="Warp" v-show="reviewsTop.rightWarp" :style="{'top':`${reviewsTop.sortListTop}px`,'right': `${reviewsTop.sortListRight}px`}">
					<view class="warpItem" :class="{'active' : reviewsTop.rightType === 0}"  @tap="typeSelectRight(0)">
						热门
					</view>
					<view class="warpItem" :class="{'active' : reviewsTop.rightType === 1}"  @tap="typeSelectRight(1)">
						最早
					</view>
					<view class="warpItem" :class="{'active' : reviewsTop.rightType === 2}"  @tap="typeSelectRight(2)">
						最新
					</view>
				</view>
			</view>
		</view>
		<view :style="{'height': popupHeight + 'px','bottom': subjectPopupBottom}" class="subjectPopup">
			<view class="popupTop">
				简介
				<u-icon name="close" color="#999" size="28" @tap="closePopup"></u-icon>
			</view>
			<view class="postContent" v-if="postDetail && subjectPopupShow">
				<view class="postSubject">
					<view class="left">
						{{postDetail.post.subject}}
					</view>
				</view>
				<view class="postTip">
					<u-icon name="clock" color="#999" size="22" style="margin-right: 3px"></u-icon>
					{{postDetail.post.created_at|changeMonAndDay}}
				</view>
				<view class="postTip" style="margin-inl;">
					{{postTip2}}
				</view>
				<view class="postTip2" v-if="postDetail.topics.length">
					<view class="postTipitem" v-for="(item,index) in postDetail.topics" :key="index">
						{{item.name}}
					</view>
				</view>
				
				<view class="content" v-html="textParse(postDetail.post.content)">
					
				</view>
				
				<view class="waring" v-if="userData.is_creator">
					<u-icon name="error-circle" color="#ddd" size="20"  style="margin-right: 3px"></u-icon>
					已开启创作声明，禁止转载或者摘编
				</view>
				
				
				<view class="reviewEnd">
					<image :src="imageBaseUrl + 'poseRequlay/reviewEnd.png'" mode="widthFix"  class="image"></image>
				</view>
			</view>
		</view>
				
		<view class="bottomInput" v-if="postDetail">
			<view class="input">
				我有话要说...
			</view>
			<view class="like" :class="{'active': choose_upvote_type}" @tap="interactionClick(1,'all')">
				<image :src="likeUrl" mode="widthFix" class="image"></image>
				<view class="num">
					{{likeNum|resetNum}}
				</view>
			</view>
			<view class="book" :class="{'active': is_collected}" @tap="bookUpdate">
				<image :src="bookUrl" mode="widthFix" class="image"></image>
				<view class="num">
					{{bookMarkNum|resetNum}}
				</view>
			</view>
		</view>
		<view class="loading"  v-if="pageLoading">
			<image src="http://8.138.116.67:5230/miyoushe/search/loading1.gif" mode="widthFix" class="loadingImg"></image>
		</view>
		
		<view class="interactionBiggerImageWrap" v-if="reviewLoading">
			<view class="interactionBiggerImage" :class="{'active': interactionBiggerImageType === 1}" >
				<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_1_active.png'" mode="widthFix" class="image"></image>
			</view>
			<view class="interactionBiggerImage" :class="{'active': interactionBiggerImageType === 2}" >
				<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_2_active.png'" mode="widthFix" class="image"></image>
			</view>
			<view class="interactionBiggerImage" :class="{'active': interactionBiggerImageType === 3}" >
				<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_3_active.png'" mode="widthFix" class="image"></image>
			</view>
			<view class="interactionBiggerImage" :class="{'active': interactionBiggerImageType === 4}" >
				<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_4_active.png'" mode="widthFix" class="image"></image>
			</view>
			<view class="interactionBiggerImage" :class="{'active': interactionBiggerImageType === 5}" >
				<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_5_active.png'" mode="widthFix" class="image"></image>
			</view>
		</view>
	</view>
</template>


<script module="test" lang="wxs">
	var isFirst = 1
	var initHeight = 0
	var aspectratio = 0
	var height = 0
	var diffHeight = 0
	var topFixDiff = 0
	var topFix = 0
	var fixTopDom = null
	var videoDom = null
	
	var initData = function(e,ins) {
		videoDom = ins.selectComponent('.videoBackgroung')
		var videoData = videoDom.getDataset()
		initHeight = Number(videoData.initheight)
		aspectratio = Number(videoData.aspectratio)
		height = initHeight
		diffHeight = height - 300
		isFirst = 0
		fixTopDom = ins.selectComponent('.reviewsTopFixed')
		var topFixTop = ins.selectComponent('.reviewsTopRef').getBoundingClientRect().top
		if(initHeight >= 300) {
			topFixDiff = topFixTop - 300
			// #ifdef MP-WEIXIN
			topFix = 300 + 85
			// #endif
			// #ifdef WEB
			topFix = 300
			// #endif
		}else{
			topFixDiff = topFixTop - initHeight
			topFix = initHeight
			// #ifdef MP-WEIXIN
			topFix = initHeight + 85
			// #endif
			// #ifdef WEB
			topFix = initHeight
			// #endif
		}
	}
	
	var pageScroll = function(e,ins) {
		var scrollTop = e.detail.scrollTop
		if(isFirst === 1) {
			initData(e,ins)
		}
		if(scrollTop > topFixDiff) {
			fixTopDom.setStyle({
				'display': 'flex',
				'top': topFix + 'px',
			})
		}else{
			fixTopDom.setStyle({
				'display': 'none'
			})
		}
		if(initHeight >= 300 && scrollTop > 0) {
			var width,height
			if(scrollTop <= diffHeight ) {
				height = initHeight - scrollTop
				width = height * aspectratio
			}else{
				height = 300
				width = 300 * aspectratio
			}
			videoDom.setStyle({
				'height':  height + 'px',
				'width':  width + 'px',
				'transition-duration': '0ms'
			})
		}
	}
	
	var init = function(e,ins) {
		isFirst = 1
	}
	
	var moveScroll = function(e,ins) {
		if(isFirst === 1) {
			initData(e,ins)
		}
		if(initHeight > 300) {
			var width = 300 * aspectratio
			videoDom.setStyle({
				'height': 300 + 'px',
				'width':  width + 'px',
				'transition-duration': '200ms'
			})
		}
	}
	
	module.exports = {
		pageScroll: pageScroll,
		init: init,
		moveScroll: moveScroll
	}
</script>

<script>
	import {mapState} from 'vuex'
	import {postFullApi,upvoteApi,follow,unfollow,collectPost} from "../../common/api.js"
	import VideoFull from "../../components/postReplay/videoFull.vue"
	import ReviewsList from '../../components/common/reviewsList.vue'
	export default {
		components: {
			VideoFull,
			ReviewsList
		},
		props: {
			post_id:{
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				postDetail: null,
				userData: null,
				is_following: false,
				is_collected: false,
				choose_upvote_type: 0,
				interactionBiggerImageZindex: '-100',
				interactionBiggerImageType: 0,
				defaultVideoData: null,
				userLabel: '',
				postTip: '',
				postTip2: '',
				reviewsTop: {
					leftText: `评论`,
					rightText: '热门',
					reviewNum: 0,
					leftType: 0,
					rightType: 0,
					show: false,
					sortListTop: 0,
					sortListLeft: 10,
					sortListRight: 10,
					rightWarp: false,
					leftWarp: false,
					rightTop: true
				},
				hiddenContainerHeight: 0,
				scrollY: true,
				loading: false,
				refresherTrg: false,
				subjectPopupShow: false,
				popupHeight: 0,
				scrollTop: 0,
				bookUrl:'http://8.138.116.67:5230/miyoushe/poseRequlay/book.png',
				bookUrl1:'http://8.138.116.67:5230/miyoushe/poseRequlay/book.png',
				bookUrl2:'http://8.138.116.67:5230/miyoushe/poseRequlay/book2.png',
				likeUrl:'http://8.138.116.67:5230/miyoushe/poseRequlay/like1.png',
				likeUrl1:'http://8.138.116.67:5230/miyoushe/poseRequlay/like1.png',
				likeUrl2:'http://8.138.116.67:5230/miyoushe//poseRequlay/like2.png',
				pageLoading: true,
				weixinTop: 0,
				scrollWrapHeight: '100%',
				dataInitHeight: 0,
				dataAspectRatio: 0,
				dataInitWidth: 0,
				videoTop: 0,
				oldScrollTop: 0,
				subjectPopupBottom: '-100%',
				reviewLoading: false,
				statObject: {},
				likeNum: null,
				bookMarkNum: null
			}
		},
		computed: {
			...mapState(['windowHeight','rpxNum','emotion','emotionKey','imageBaseUrl']),
		},
		created() {
			// #ifdef MP-WEIXIN
			this.weixinTop = 170 / this.rpxNum
			this.scrollWrapHeight = this.windowHeight - this.weixinTop + 'px'
			this.videoTop = '170rpx'
			// #endif
			this.getPostFullData()
		},
		methods: {
			async getPostFullData() {
				if(!this.post_id) return
				const {data: res} = await postFullApi(this.post_id)
				this.userData = res.data.post.user
				this.is_following = res.data.post.user.is_following
				this.is_collected = res.data.post.self_operation.is_collected
				this.postDetail = res.data.post
				this.statObject = this.postDetail.stat.post_upvote_stat
				this.likeNum = this.postDetail.stat.like_num
				this.bookMarkNum = this.postDetail.stat.bookmark_num
				this.choose_upvote_type = res.data.post.self_operation.upvote_type
				if(this.is_collected) {
					this.bookUrl = this.bookUrl2
				}else{
					this.bookUrl = this.bookUrl1
				}
				if(this.choose_upvote_type === 0) {
					this.likeUrl = this.likeUrl1
				}else if(this.choose_upvote_type === 1) {
					this.likeUrl = this.likeUrl2
				}else{
					this.likeUrl = `${this.imageBaseUrl}poseRequlay/post_upvote_stat_${this.choose_upvote_type}.png`
				}
				this.reviewsTop.reviewNum = this.postDetail.stat.reply_num
				this.reviewsTop.leftText = `评论(${this.reviewsTop.reviewNum})`
				const video = res.data.post.vod_list[0]
				this.screenPostTip()
				if(!this.defaultVideoData) {
					let resolutions
					if(video.resolutions.length > 1) {
						resolutions = video.resolutions[video.resolutions.length - 1]
					}else{
						resolutions = video.resolutions[0]
					}
					this.defaultVideoData = {
						post_id: this.post_id,
						src:  resolutions.url,
						durationTime: video.duration / 1000,
						currentTime: 0,
						detail: video
					}
				}
				this.pageLoading = false
			},
			async interactionClick(type,other) {
				let is_cancel
				if(type === this.choose_upvote_type || 
					(other === 'all' && this.choose_upvote_type)) {
					is_cancel = true
				}else{
					is_cancel = false
				}
				
				const data = {
					is_cancel,
					"post_id": this.post_id,
					"upvote_type": type
				}
				const {data: res} = await upvoteApi(data)
				if(res.message === 'OK') {
					if(is_cancel) {
						this.statObject[this.choose_upvote_type - 1].upvote_cnt -= 1
						this.choose_upvote_type = 0
						this.likeUrl = this.likeUrl1
						this.likeNum -= 1
					}else{
						if(this.choose_upvote_type) {
							this.statObject[this.choose_upvote_type - 1].upvote_cnt -= 1
						}else{
							this.likeNum += 1
						}
						this.statObject[type - 1].upvote_cnt += 1
						this.choose_upvote_type = type
						if(type === 1) {
							this.likeUrl = this.likeUrl2
						}else{
							this.likeUrl = `${this.imageBaseUrl}poseRequlay/post_upvote_stat_${type}.png`
						}
					}
					if(!is_cancel) {
						this.interactionBiggerImageType = type
						let timer = setTimeout(()=> {
							this.interactionBiggerImageType = 0
							clearTimeout(timer)
						},1600)
					}
				}
			},
			async bookUpdate() {
				const is_collected = this.is_collected
				let is_cancel
				if(is_collected) {
					is_cancel = true
				}else{
					is_cancel = false
				}
				const data = {
					    is_cancel,
					    "post_id": this.post_id
					}
				const {data: res} = await collectPost(data)
				if(res.message === 'OK') {
					if(is_collected) {
						this.bookUrl = this.bookUrl1
						this.bookMarkNum -= 1
					}else{
						this.bookUrl = this.bookUrl2
						this.bookMarkNum += 1
					}
					this.is_collected = !is_collected
				}
			},
			screenPostTip() {
				if(this.postDetail.forum) {
					const gameType = this.postDetail.forum.game_id === 2 ? '原神' : '其他'
					if(this.postDetail.forum.forum_cate) {
						this.postTip = `| ${this.postDetail.forum.forum_cate.name} · ${gameType} | ${this.postDetail.forum.name}`
						this.postTip2 = `${this.postDetail.forum.forum_cate.name} · ${gameType} | ${this.postDetail.forum.name}`
					}else{
						this.postTip = `| ${this.postDetail.forum.name}`
						this.postTip2 = `${this.postDetail.forum.name}`
					}
				}
			},
			async followUser(userId) {
				if(!this.is_following) {
					const {data: res} = await follow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = true
						this.$refs.videoFullRef.is_following = true
					}
				}else{
					const {data: res} = await unfollow({
						 "entity_id": userId
					})
					if(res.message === 'OK'){
						this.is_following = false
						this.$refs.videoFullRef.is_following = false
					}
				}
			},
			showSort(event,type) {
				this.reviewsTop.show = true
				this.scrollY = false
				if(type === 'left') {
					this.reviewsTop.rightWarp = false
					this.reviewsTop.leftWarp = true
				}
				if(type === 'right') {
					this.reviewsTop.leftWarp = false
					this.reviewsTop.rightWarp = true
				}
				this.reviewsTop.sortListTop = event.touches[0].clientY + 15
			},
			fixWrappClick(e) {
				this.reviewsTop.show = false
				this.scrollY = true
				e.preventDefault()
				e.stopPropagation()
			},
			typeSelectLeft(type) {
				if(this.reviewsTop.leftType === type) return
				this.$nextTick(() => {
					if(type === 1) {
						this.$refs.reviewsListRef.is_hot = false
						this.$refs.reviewsListRef.only_master = true
						this.$refs.reviewsListRef.order_type = 1
						this.reviewsTop.rightTop = false
						this.$refs.reviewsListRef.lzReviewReply = true
					}else{
						this.$refs.reviewsListRef.is_hot = true
						this.$refs.reviewsListRef.only_master = false
						this.$refs.reviewsListRef.order_type = 0
						this.reviewsTop.rightTop = true
						this.$refs.reviewsListRef.lzReviewReply = false
					}

					this.$refs.reviewsListRef.getPostReplayData('refresh',() => {
						if(type === 1) {
							this.reviewsTop.leftText = `只看楼主`
						}else{
							this.reviewsTop.leftText = `评论(${this.reviewsTop.reviewNum})`
						}
						this.reviewsTop.leftType = type
						this.scrollReset()
					},true)
				})
			},
			typeSelectRight(type) {
				if(this.reviewsTop.rightType === type) return
				this.$nextTick(() => {
					this.$refs.reviewsListRef.only_master = false
					if(type === 1) {
						this.$refs.reviewsListRef.is_hot = false
						this.$refs.reviewsListRef.order_type = 1
					}else if(type === 2){
						this.$refs.reviewsListRef.is_hot = false
						this.$refs.reviewsListRef.order_type = 2
					}else{
						this.$refs.reviewsListRef.is_hot = true
						this.$refs.reviewsListRef.order_type = 0
					}
					
					this.$refs.reviewsListRef.getPostReplayData('refresh',() => {
						if(type === 1) {
							this.reviewsTop.rightText = `最早`
						}else if(type === 2){
							this.reviewsTop.rightText = `最新`
						}else{
							this.reviewsTop.rightText = `热门`
						}
						this.reviewsTop.rightType = type
						this.scrollReset()
					},true)
				})
			},
			setHiddenContainerStyle(height) {
				this.hiddenContainerHeight = height
				this.dataInitHeight = height
				this.$nextTick(() => {
					const refs =  this.$refs.videoFullRef
					this.dataAspectRatio = refs.video.aspectRatio
					this.dataInitWidth = refs.video.videoWidth * this.rpxNum
					this.heightIsChange = refs.video.heightIsChange
					this.scrollHeightChange = refs.scrollHeightChange
					this.miniHeight = refs.video.miniHeight 
					this.diffHeight = height - this.miniHeight
					const height2 = this.windowHeight - this.miniHeight 
					if(this.diffHeight > 0) {
						// #ifdef MP-WEIXIN
						this.popupHeight = this.windowHeight - this.miniHeight  - this.weixinTop + 31
						// #endif
						// #ifdef WEB
						this.popupHeight = this.windowHeight - this.miniHeight - this.weixinTop
						// #endif
					}else{
						// #ifdef MP-WEIXIN
						this.popupHeight = this.windowHeight - height - this.weixinTop + 31
						// #endif
						// #ifdef WEB
						this.popupHeight = this.windowHeight - height  - this.weixinTop
						// #endif
					}
					
					let view = uni.createSelectorQuery().in(this).select(".postContentCenterWrap");
					view.fields(
						  {
							  size: true
						  },
					    (data) => {
						  if(this.diffHeight > 0) {
							  this.judgeTop = this.diffHeight + data.height + 24
						  }else{
							  this.judgeTop = data.height + 24
						  }
					    }
					  )
					  .exec();
					  
					  this.reviewLoading = true
				})
			},
			scrolltolower() {
				this.$nextTick(() => {
					this.$refs.reviewsListRef.getPostReplayData('update')
				})
			},
			scrollPull(e) {
				//#ifdef MP-WEIXIN
				const deltaY = e.detail.dy
				const load = deltaY > 50
				//#endif
				//#ifndef MP-WEIXIN 
				const deltaY = e.detail.deltaY
				const load = deltaY > 50
				//#endif 
				if(deltaY < 0) {
					return
				}
				if(load) {
					if(this.loading) return
					this.loading = true
					this.refresherTrg = true
					this.$refs.reviewsListRef.getPostReplayData('refresh',() => {
						this.loading = false
						this.refresherTrg = false
					},true)
				}
			},
			showSubjectDetail(){
				this.subjectPopupShow = true
				if(this.diffHeight > 0) {
					this.scrollTop = this.oldScrollTop
					this.$nextTick(()=> {
						this.scrollTop = this.diffHeight
						this.oldScrollTop = this.scrollTop - 1
					}) 
				}
				this.subjectPopupBottom = '0'
			},
			closePopup() {
				this.subjectPopupShow = false
				this.subjectPopupBottom = '-100%'
			},
			scrollReset() {
				this.scrollTop = this.oldScrollTop
				this.$nextTick(()=> {
					this.scrollTop = this.judgeTop
					this.oldScrollTop = this.scrollTop - 1
				}) 
			},
			textParse(text) {
				const regex = /_\((.*?)\)/g;
				const matches = text.match(regex);
				let emotion = this.emotion
				
				const regex2 = /<img\b[^>]*src=['"]([^'"]*)['"][^>]*>/g;
				
				text = text.replace(regex2, function(match, src) {
				  // 在匹配到的<img>标签后添加style属性
				  const style = "style='width: 100px; border-radius: 6px; display: block;'";
				  return `<img src='${src}' ${style}>`;
				});
				if(matches) {
					let newMatch = []
					for(let i = 0; i < matches.length; i ++) {
						if(!newMatch.includes(matches[i])) {
							newMatch.push(matches[i])
						}
					}
					for(let i = 0; i < newMatch.length; i ++ ) {
						let isReturn = false
						for(let k = 0; k < emotion.list.length; k ++) {
							const item = emotion.list[k]
							if(item.list) {
								const itemLength = item.list.length
								for(let f = 0; f < itemLength ; f ++) {
									const item2 = item.list[f]
									if(`_(${item2.name})` === newMatch[i]) {
										isReturn = true
										const reg = new RegExp(`_\\(${item2.name}\\)`,'g')
										const imageHtml = `<img src="${item2.icon}"  style="height: 36px;margin-left: 5px;display:inline-block;vertical-align: bottom"></img>`
										return text.replace(reg, imageHtml);
									}
								}
							}else{
								return
							}
							if(isReturn) {
								return
							}
						}
					}
				}
				return text.replace(/\n/g, '<br>');
			},
			goBack() {
				// uni.navigateBack()
				uni.$emit('navGoBack','postReplay')
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
				return `${createMon}-${createDay}`
			},
			getUserLabel(data) {
				if(data.certification && data.certification.label) {
					return data.certification.label
				}else if(data.introduce){
					return data.introduce
				}else{
					return ''
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.postReplayContent{
	height: 100%;
	position: relative;
	// #ifdef MP-WEIXIN
	padding-top: 170rpx;
	// #endif
	box-sizing: border-box;
	width: 100%;
	background: #fff;
	
	.videoWrapper{
		display: inline-block;
		width: 100%;
		background: #000;
		z-index: 10;
		position: absolute;
		left: 0;
		font-size: 0;
		
		.videoBackgroung{
			margin: 0 auto;
			
			&.animate{
				transition-duration: 300ms;
			}
		}
	}
	
	.loading{
		width: 750rpx;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.loadingImg{
			width: 400rpx;
		}
	}
	
	.topTitleTab{
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		background: rgba(0, 72, 135, 0.5);
		height: 70rpx;
		z-index: 101;
		// #ifdef MP-WEIXIN
		height: 170rpx;
		box-sizing: border-box;
		padding-top: 90rpx;
		// #endif
		
		.goBack{
			width: 48rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 12rpx;
			// #ifdef MP-WEIXIN
			bottom: 8px;
			// #endif
			/* #ifndef MP-WEIXIN */
			top: 50%;
			transform: translateY(-50%);
			/* #endif */
		}
	}
	
	
	.loadingGif{
		height: 60px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.postContent{
		padding: 24rpx;
		
		.postSubject{
			position: relative;
			
			.left{
				width: 600rpx;
				line-height: 40rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: 600;
			}
			
			.right{
				position: absolute;
				right: 8rpx;
				top: 4rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.postTip{
			margin-top: 4px;
			font-size: 24rpx;
			color: #999;
		}
		
		.postTip2{
			display: flex;
			flex-wrap: wrap;
			
			.postTipitem{
				margin-top: 4px;
				margin-right: 18rpx;
				padding: 1px 4px;
				border-radius: 4px;
				background: #f2f4f5;
				color: #999;
				font-size: 20rpx;
			}
		}
		
		.interaction{
			display: flex;
			margin-top: 12px;
			
			.interactionItems{
				width: 173.2rpx;
				height: 64rpx;
				margin-right: 6rpx;
				border-radius: 16rpx;
				border: 1px solid #f2f4f5;
				display: flex;
				justify-content: center;
				align-items: center;
				
				&:last-of-type{
					margin-right: 0;
				}
				
				&.active{
					border-color: #ff7e3d;
					
					.num{
						color: #ff7e3d;
					}
				}
				
				.imagLogo{
					height: 36rpx;
					
					.image{
						height: 36rpx;
						font-size: 0;
					}
				}
				
				.num{
					font-size: 20rpx;
					color: #999;
					padding-left: 4rpx;
				}
			}
		}
		
		.userMessageWrap{
			margin-top: 15px;
			padding-top: 8px;
			border-top: 1px solid #f2f4f5;
			display: flex;
			align-items: center;
			position: relative;
			
			.userImage{
				width: 72rpx;
				height: 72rpx;
				position: relative;
				font-size: 0;
				
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
					right: -4rpx;
					bottom: -4rpx;
					width: 20rpx;
					height: 20rpx;
				}
			}
			
			.userMessage{
				padding-left: 12rpx;
				max-width: 500rpx;
				
				.userName{
					font-size: 24rpx;
					color: #000;
					height: 42rpx;
					display: flex;
					align-items: center;
					margin-top: 6rpx;
					
					.levelLogo{
						height: 24rpx;
						margin-left: 5px;
					}
				}
				
				.userLabel{
					font-size: 22rpx;
					color: #ddd;
					line-height: 32rpx;
				}
			}
			
			.follow{
				padding: 3px;
				width: 40px;
				border-radius: 3px;
				background: #3c9cff;
				color: #fff;
				text-align: center;
				font-size: 20rpx;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				margin-top: 8rpx;
				
				&.unfollow{
					color: #999;
					background: #f2f4f5;
				}
			}
		}
		
		
		.reviews{
			margin: 12px -24rpx 0;
			border-top: 5px solid #f2f4f5;
		}
	}
	
	.reviewsTop{
		display: flex;
		justify-content: space-between;
		padding: 10px 24rpx;
		font-size: 24rpx;
		border-bottom: 1px solid #f2f4f5;
		box-sizing: border-box;
		width: 750rpx;
		background: #fff;
		z-index: 10;
		
		&.fixed{
			position: absolute;
			right: 0;
			display: none;
		}
	}
	
	.topLeft{
		display: flex;
		align-items: center;
		color: #222;
		
		
	}
	
	.topRight{
		display: flex;
		align-items: center;
		color: #999;
		
		.image{
			height: 14px;
			margin-left: 3px;
			margin-top: 2px;
		}
	}
	
	.fixWrapp{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		
		.Warp{
			position: absolute;
			background: #fff;
			width: 150rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			border-radius: 8px;
			
			.warpItem{
				padding: 16rpx 0;
				font-size: 24rpx;
				color: #000;
				
				&.active{
					color: $uni-color-theme-color
				}
			}
			&::after{
				content: '';
				display: block;
				background: #fff;
				width: 10px;
				height: 10px;
				position: absolute;
				left: 50%;
				transform: translateX(-50%) rotate(45deg);
				top: -4px;
			}
		}
	}
	

	
	.subjectPopup{
		position: absolute;
		z-index: 10;
		left: 0;
		width: 750rpx;
		background: #fff;
		transition-duration: 300ms;
		
		.popupTop{
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #f2f4f5;
			padding: 24rpx;
			font-size: 24rpx;
			color: #000;
		}
		
		.postTip{
			display: flex;
			align-items: center;
		}
		
		.postSubject{
			.left{width: 100%;}
		}
		
		.content{
			margin-top: 12px;
			padding-top: 10px;
			border-top: 1px solid #f2f4f5;
			font-size: 30rpx;
			line-height: 1.5em;
			padding-bottom: 10px;
		}
		
		.waring{
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #ddd;
			
		}
		
		.reviewEnd{
			padding: 15px 0 30px;
			
			.image{
				width: 450rpx;
				margin: 0 auto;
				display: block;
			}
		}
	}
	
	.bottomInput{
		display: flex;
		bottom: 0;
		width: 750rpx;
		background: #f2f4f5;
		text-align: center;
		box-sizing: border-box;
		/* #ifdef WEB */
		padding: 4px 24rpx 20rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding: 4px 24rpx 60rpx;
		/* #endif */
		border-top: 1px solid #eee;
		position: fixed;
		font-size: 24rpx;
		color: #999;
		justify-content: space-between;
		
		.input{
			height: 64rpx;
			width: 500rpx;
			background: #fff;
			color: #999;
			border-radius: 4px;
			padding-left: 8px;
			line-height: 64rpx;
			text-align: left;
		}
		
		.like{
			.image{
				width: 40rpx;
				height: 40rpx;
			}
			
			&.active{
				color: #ff7e3d;
			}
		}
		
		.book{
			.image{
				width: 40rpx;
				height: 40rpx;
			}
			
			&.active{
				color: #ff7e3d;
			}
		}
	}
	
	.interactionBiggerImageWrap{
		position: absolute;
		height: 100%;
		width: 750rpx;
		background: transparent;
		top: 0;
		z-index: 10;
		right: -150%;
		
		
		.interactionBiggerImage{
			width: 460rpx;
			position: absolute;
			left: 0;
			top:50%;
			transform: translateY(-50%);
			
			.image{
				width: 460rpx;
			}
			
			&.active{
				left: -130%;
			}
		}
		
	}
}

	
</style>
