<template>
	<view class="postReplayContent">
		<template v-if="!pageLoading">
			<view class="reviewsTop fixed" :style="{'top' : fixTop,'display': reviewsTopFixed}">
					<view class="topLeft">
						<view class="topLeftItem" :class="{'active' : reviewsTop.leftType === 0}" @tap="typeSelectLeft()">
							全部评论
						</view>
						<view class="topLeftItem"  :class="{'active' : reviewsTop.leftType === 1}"  @tap="typeSelectLeft(1)">
							只看楼主
						</view>
					</view>
					<view class="topRight" v-show="reviewsTop.rightTop">
						<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 0}"  @tap="typeSelectRight(0)">
							热门
						</view>|
						<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 1}"  @tap="typeSelectRight(1)">
							最早
						</view>|
						<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 2}"  @tap="typeSelectRight(2)">
							最新
						</view>
					</view>
				</view>
				
				<view class="topTitleTab">
					<view class="goBack" @tap.stop="goBack">
						<u-icon name="arrow-left" color="#FFFFFF" size="36"></u-icon>
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
								<view class="text">
									{{userData.nickname}}
								</view>
								<image :src="`https://bbs-static.miyoushe.com/level/level${userData.level_exp.level}.png`" 
									mode="heightFix" class="levelLogo">
								</image>
							</view>
						</view>
						<view class="follow" @tap.stop="followUser(userData.uid)" v-if="!this.is_following">
							+ 关注
						</view>
						<view class="follow unfollow" @tap.stop="followUser(userData.uid)" v-if="this.is_following">
							已关注
						</view>
					</view>
				</view>
				
			<scroll-view :scroll-y="scrollY" :style="{'height': windowHeight*rpxNum - scrollPadding + 'rpx'}" :scroll-top="scrollTop"
				@scroll="pageScroll" @scrolltolower="scrolltolower" :refresher-enabled="true" :show-scrollbar="true"
				:refresher-triggered="refresherTrg"  @refresherpulling="scrollPull" :scroll-with-animation='true'
			>
				<view class="postContent" v-if="postDetail.post">
					<view class="postSubject">
						<view class="left" v-if="forumType != 'COS'">
							{{postDetail.post.subject}}
						</view>
						<view class="content">
							<view v-if="forumType != 'COS'" v-html="textParse(postDetail.post.content,'100%')">
								
							</view>
							<view v-if="forumType === 'COS' && newImageList && swiperHeight" style="width: 750rpx;margin-left: -24rpx;position: relative;">
								<swiper :style="{'height': swiperHeight + 'rpx'}" @change="swiperChange">
									<swiper-item v-for="(item,index) in newImageList" :key="index">
										<view class="swiper-item" v-if="index <= swiperCurrent + 2">
											<image :src="item.url" mode="widthFix" :style="{'width': item.width + 'rpx'}" class="image"></image>
										</view>
									</swiper-item>
								</swiper>
								<view class="swiperNum">
									{{swiperCurrent + 1}}/{{newImageList.length}}
								</view>
								<view class="swiperIndicator">
									<view class="swiperIndicatorWrap" :style="{'transform' : `translate(${indiTran}, 0px) translateZ(0px)`}">
										<view class="swiper-item-i" :class="{'select': index === swiperCurrent,'scale': scale.includes(index) }"
											v-for="(item,index) in newImageList" :key="index">
											
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="left" v-if="forumType === 'COS'" style="margin-top: 8px;">
							{{postDetail.post.subject}}
						</view>
						<view class="content" v-if="forumType === 'COS'" style="margin-top: 8px;">
							<view v-html="structured_content">
								
							</view>
						</view>
					</view>
					<view class="postTip2" v-if="postDetail.topics.length">
						<view class="postTipitem" v-for="(item,index) in postDetail.topics" :key="index">
							{{item.name}}
						</view>
					</view>
					<view class="interaction">
						<view class="interactionItems"  @tap.stop="interactionClick(item.upvote_type)" 
						:class="{'active': choose_upvote_type === index + 1}"
						v-for="(item,index) in postDetail.stat.post_upvote_stat" :key="index">
							<view class="imagLogo">
								<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_'+ (index + 1) +'.png'" mode="heightFix" class="image"></image>
							</view>
							<view class="num">
								{{item.upvote_cnt|resetNum}}
							</view>
							<view class="interactionBiggerImageWrap" v-if="interactionBiggerImageType === index + 1">
								<image :src="imageBaseUrl + 'poseRequlay/post_upvote_stat_'+ (index + 1) +'_active.png'" mode="widthFix" class="interactionBiggerImage"></image>
							</view>
						</view>
					</view>
					<view class="postTip">
						发布于{{postDetail.post.created_at|changeMonAndDay}}
					</view>
					
					<view class="reviews">
						<view style="width: 750rpx;height: 74rpx;" class="reviewsTopRef">
							<view class="reviewsTop">
								<view class="topLeft">
									<view class="topLeftItem" :class="{'active' : reviewsTop.leftType === 0}" @tap="typeSelectLeft(0)">
										全部评论
									</view>
									<view class="topLeftItem"  :class="{'active' : reviewsTop.leftType === 1}"  @tap="typeSelectLeft(1)">
										只看楼主
									</view>
								</view>
								<view class="topRight" v-show="reviewsTop.rightTop">
									<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 0}"  @tap="typeSelectRight(0)">
										热门
									</view>|
									<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 1}"  @tap="typeSelectRight(1)">
										最早
									</view>|
									<view class="topLeftItem" :class="{'active' : reviewsTop.rightType === 2}"  @tap="typeSelectRight(2)">
										最新
									</view>
								</view>
							</view>
						</view>
						
						<reviews-list v-if="post_id" :post_id="post_id" ref="reviewsListRef"> </reviews-list>
					</view>
				</view>
			</scroll-view>
				
			<view class="bottomInput" v-if="postDetail.post">
				<view class="input">
					我有话要说...
				</view>
				<view class="review" :class="{'active': choose_upvote_type}" @tap="interactionClick(1,'all')">
					<image src="../../static/message.png" mode="widthFix" class="image"></image>
					<view class="num">
						{{reviewsTop.reviewNum|resetNum}}
					</view>
				</view>
				<view class="like" :class="{'active': choose_upvote_type}" @tap="interactionClick(1,'all')">
					<image :src="likeUrl" mode="widthFix" class="image"></image>
					<view class="num">
						{{postDetail.stat.like_num|resetNum}}
					</view>
				</view>
				<view class="book" :class="{'active': is_collected}" @tap="bookUpdate">
					<image :src="bookUrl" mode="widthFix" class="image"></image>
					<view class="num">
						{{postDetail.stat.bookmark_num|resetNum}}
					</view>
				</view>
			</view>
		</template>
		<image src="http://8.138.116.67:5230/miyoushe/search/loading1.gif" mode="aspectFit" class="pageloading" v-if="pageLoading"></image>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {postFullApi,upvoteApi,follow,unfollow,collectPost} from "../../common/api.js"
	import ReviewsList from '../../components/common/reviewsList.vue'
	export default {
		components: {
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
				postDetail: {},
				userData: null,
				is_following: false,
				is_collected: false,
				choose_upvote_type: 0,
				interactionBiggerImageType: 0,
				userLabel: '',
				reviewsTop: {
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
				scrollY: true,
				loading: false,
				refresherTrg: false,
				scrollTop: 0,
				reviewsTopFixed: 'none',
				fixTop: 0,
				bookUrl:'http://8.138.116.67:5230/miyoushe/poseRequlay/book.png',
				bookUrl1:'http://8.138.116.67:5230/miyoushe/poseRequlay/book.png',
				bookUrl2:'http://8.138.116.67:5230/miyoushe/poseRequlay/book2.png',
				likeUrl:'http://8.138.116.67:5230/miyoushe/poseRequlay/like1.png',
				likeUrl1:'http://8.138.116.67:5230/miyoushe/poseRequlay/like1.png',
				likeUrl2:'http://8.138.116.67:5230/miyoushe//poseRequlay/like2.png',
				forumType: null,
				swiperCurrent: 0,
				swiperOldCurrent: 0,
				indiTran: 0,
				scale: [4,5,6,7,8,9],
				newImageList: [],
				swiperHeight: 0,
				structured_content: '',
				pageLoading: true,
				weixinTop: 0,
				// #ifdef WEB
				scrollPadding: 100,
				// #endif
				// #ifdef MP-WEIXIN
				scrollPadding: 260,
				// #endif
			}
		},
		created() {
			// #ifdef MP-WEIXIN
			this.weixinTop = 170 / this.rpxNum
			// #endif
			this.getPostFullData()
		},
		computed: {
			...mapState(['windowHeight','rpxNum','emotion','emotionKey','imageBaseUrl'])
		},
		methods: {
			async getPostFullData() {
				if(!this.post_id) return
				const {data: res} = await postFullApi(this.post_id)
				this.postDetail = res.data.post
				this.userData = this.postDetail.user
				this.is_following = this.postDetail.user.is_following
				this.is_collected = this.postDetail.self_operation.is_collected
				if(this.postDetail.forum &&this.postDetail.forum.name === 'COS') {
					this.resetSwiperHeight(this.postDetail.image_list)
					const content = JSON.parse(this.postDetail.post.content)
					const str = JSON.stringify(content.describe)
					if(str) {
						const newStr = str.slice(1, -1).replace(/\\n/g, '<br>')
						this.structured_content = this.textParse(newStr,'36px')
					}
				}
				this.choose_upvote_type = this.postDetail.self_operation.upvote_type
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
				const video = this.postDetail.vod_list[0]
				
				// #ifdef WEB
				this.fixTop = 100 + 'rpx'
				// #endif
				// #ifdef MP-WEIXIN
				this.fixTop = this.weixinTop + 'px'
				// #endif
				
				this.$nextTick(function() {
					const ref = uni.createSelectorQuery().in(this).select(".reviewsTopRef");
					ref.fields({
					  rect: true
					}, data => {
						if(data) {
							this.judgeTop = data.top
						}
					}).exec()
				})
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
						this.choose_upvote_type = 0
						this.likeUrl = this.likeUrl1
					}else{
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
							this.interactionBiggerImageType = 10
							clearTimeout(timer)
						},1500)
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
					this.is_collected = !is_collected
					if(this.is_collected) {
						this.bookUrl = this.bookUrl2
					}else{
						this.bookUrl = this.bookUrl1
					}
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
						this.reviewsTop.leftType = type
							this.scrollTop = this.oldScrollTop
							this.$nextTick(function() {
								this.scrollTop = this.judgeTop
							})
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
						this.reviewsTop.rightType = type
							this.scrollTop = this.oldScrollTop
							this.$nextTick(function() {
								this.scrollTop = this.judgeTop
							})
					},true)
				})
			},
			pageScroll(e) {
				let scrollTop = e.detail.scrollTop
				this.oldScrollTop = scrollTop
				const ref = uni.createSelectorQuery().in(this).select(".reviewsTopRef");
				ref.fields({
				  rect: true
				}, data => {
					if(data) {
						 if(data.top  < this.weixinTop) {
						 	this.reviewsTopFixed = 'flex'
						 }else{
						 	this.reviewsTopFixed = 'none'
						 }
					}
				}).exec()
			},
			scrolltolower() {
				if(!this.loading) {
					this.$nextTick(() => {
						this.$refs.reviewsListRef.getPostReplayData('update')
					})
				}
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
			resetSwiperHeight(imgList) {
				this.swiperHeight = 0
				for(let i = 0; i < imgList.length; i ++) {
					const item = imgList[i]
					const aspectRatio = item.width / item.height
					let obj
					let newHeight
					if(aspectRatio > 1) {
						newHeight = 750 / aspectRatio
						obj = {
							url: item.url,
							size: item.size,
							format: item.format,
							entity_type: item.entity_type,
							entity_id: item.entity_id,
							width: 750,
							height: newHeight,
						}
					}else{
						newHeight = this.windowHeight * 0.7 * this.rpxNum
						obj = {
							url: item.url,
							size: item.size,
							format: item.format,
							entity_type: item.entity_type,
							entity_id: item.entity_id,
							width: newHeight * aspectRatio,
							height: newHeight,
						}
					}
					this.newImageList.push(obj)
					if(this.swiperHeight < newHeight) {
						this.swiperHeight = newHeight
					}
				}

				this.forumType = this.postDetail.forum.name
			},
			swiperChange(e) {
				const current = e.detail.current
				this.swiperCurrent = current
				let indiTran 
				if(this.swiperCurrent > 3) {
					const num = this.swiperCurrent - 3
					indiTran = - 20 * num
					this.indiTran = indiTran + 'rpx'
					this.scale = [this.swiperCurrent + 1,this.swiperCurrent+2,this.swiperCurrent - 3,this.swiperCurrent - 4]
				}else{
					this.indiTran = 0 + 'rpx'
					this.scale = [4,5,6]
				}
				this.swiperOldCurrent = current
			},
			textParse(text,size) {
				const regex = /_\((.*?)\)/g;
				const matches = text.match(regex);
				let emotion = this.emotion
				
				const regex2 = /<img\b[^>]*src=['"]([^'"]*)['"][^>]*>/g;
				
				text = text.replace(regex2, function(match, src) {
				  // 在匹配到的<img>标签后添加style属性
				  const style = "style='width: 100%; border-radius: 4px; margin: 3px 0;'";
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
										const imageHtml = `<img src="${item2.icon}" class="emotionIcon" style="width: 100%"></img>`
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
				uni.$emit('navGoBack','artical')
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
.pageloading{
	width: 400rpx;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	z-index: 10;
}
.postReplayContent{
	height: 100%;
	position: relative;
	// #ifdef MP-WEIXIN
	padding-top: 170rpx;
	// #endif
	box-sizing: border-box;
	
	.topTitleTab{
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		background: #004887;
		height: 100rpx;
		z-index: 10;
		// #ifdef MP-WEIXIN
		height: 170rpx;
		box-sizing: border-box;
		padding-top: 90rpx;
		// #endif
		display: flex;
		align-items:center;
		
		.goBack{
			width: 50rpx;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 30rpx;
			margin-left: 20rpx;
		}
		
		.userMessageWrap{
			display: flex;
			align-items: center;
			
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
					color: #fff;
					height: 42rpx;
					display: flex;
					align-items: center;
					margin-top: 6rpx;
					
					
					.levelLogo{
						height: 24rpx;
						margin-left: 5px;
					}
					
					/* #ifdef MP-WEIXIN */
					.text{
						max-width: 140rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					/* #endif */
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
				background: #fff;
				color: #3c9cff;
				text-align: center;
				font-size: 20rpx;
				position: absolute;
				right: 32rpx;
				top: 50%;
				transform: translateY(-50%);
				margin-top: 8rpx;
				border: 1px solid #3c9cff;
				line-height: 1.5em;
				/* #ifdef MP-WEIXIN */
				right: 220rpx;
				margin-top: 40rpx;
				/* #endif */
				
				&.unfollow{
					color: #ddd;
					border: 1px solid #ddd;
				}
			}
		}
	}
	
	
	.loadingGif{
		height: 60px;
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.postContent{
		padding: 24rpx;
		/* #ifdef WEB */
		padding-top: 120rpx;
		/* #endif */
		
		.postSubject{
			position: relative;
			
			.left{
				width: 100%;
				line-height: 40rpx;
				font-size: 42rpx;
				line-height: 1.5em;
				color: #333;
				font-weight: 600;
			}
			
			.content{
				margin-top: 12px;
				font-size: 28rpx;
				font-weight: 500;
				color: #333;
				
				.swiper-item{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100%;
					
					.image{
						border-radius: 6px;
					}
				}
				
				.swiperNum{
					position: absolute;
					right: 24rpx;
					top: 12rpx;
					border-radius: 44rpx;
					height: 44rpx;
					width: 70rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 24rpx;
					background: rgba(0, 0, 0, 0.5);
				}
				
				.swiperIndicator{
					width: 100rpx;
					height: 20rpx;
					margin: 20rpx auto;
					overflow: hidden;
					
					.swiperIndicatorWrap{
						display: flex;
						align-items: center;
						width: 500rpx;
						transition-duration: 300ms;
					}
					
					.swiper-item-i{
						width: 12rpx;
						height: 12rpx;
						border-radius: 12rpx;
						background: #ddd;
						margin:0 4rpx;
						
						&.select{
							background: #3c9cff;
						}
						
						&.scale{
							transform: scale(0.7);
						}
					}
				}
			}
		}
		
		.postTip{
			margin-top: 8px;
			font-size: 20rpx;
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
					border-color: #ffcd69;
					
					.num{
						color: #ffcd69;
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
			position: fixed;
			left: 0;
			
		}
	}
	
	.topLeft{
		display: flex;
		align-items: center;
		color: #999;
		
		.topLeftItem{
			padding-right: 26rpx;
			
			&.active{
				color: #000;
			}
		}
		
	}
	
	.topRight{
		display: flex;
		align-items: flex-end;
		color: #999;
		
		.topLeftItem{
			padding:0 10rpx;
			
			&.active{
				color: #000;
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
			width: 440rpx;
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
				color: #ffcd69;
			}
		}
		
		.review{
			.image{
				width: 52rpx;
				height: 52rpx;
			}
			
			.num{
				margin-top: -8rpx;
			}
			
			&.active{
				color: #ffcd69;
			}
		}
		
		.book{
			.image{
				width: 44rpx;
				height: 44rpx;
			}
			.num{
				margin-top: -4rpx;
			}
			
			&.active{
				color: #ffcd69;
			}
		}
	}
}

	
</style>
