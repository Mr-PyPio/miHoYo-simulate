<template>
	<view class="searchPostContent">
		<view class="tab">
			<scroll-view :scroll-x="true" style="white-space: nowrap;" @scroll="tabSwiper" 
			:scroll-left="scrollLeft" :scroll-with-animation="true">
				<view class="tabWrap">
					<view class="tabItem" :class="{'active': index === current}" v-for="(item,index) in tabList" 
					 @tap.stop="tabItemClick(index)"  :key="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="swiperContent" :style="{'height' : windowHeight + 'px'}">
			<swiper :current="current" style="height: 100%;width: 100%;" @change="swiperChange" :scroll-with-animation='true'>
				<swiper-item  class="swiper-item">
					<all-post  ref="allRefs" ></all-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<strategy-post  ref="strategyRefs" ></strategy-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<video-post  ref="videoRefs" ></video-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<encycle-post  ref="encycleRefs" ></encycle-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<image-post  ref="imageRefs" ></image-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<user-post  ref="userRefs" ></user-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<topic-post  ref="topicRefs" ></topic-post>
				</swiper-item>
				<swiper-item class="swiper-item" >
					<authority-post ref="autorityRefs"></authority-post>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import AllPost from './allPost.vue'
	import StrategyPost from './strategyPost.vue'
	import TopicPost from './topicPost.vue'
	import UserPost from './userPost.vue'
	import VideoPost from './videoPost.vue'
	import ImagePost from './imagePost.vue'
	import EncyclePost from './encyclePost.vue'
	import AuthorityPost from './authorityPost.vue'
	import {mapState} from 'vuex'
	export default {
		name:"searchPost",
		components: {
			AllPost,
			StrategyPost,
			TopicPost,
			UserPost,
			VideoPost,
			ImagePost,
			EncyclePost,
			AuthorityPost
		},
		data() {
			return {
				scrollY: true,
				keyWord: '',
				tabList: ['综合','攻略','视频','百科','图片','用户','话题','官方'],
				current: 0,
				scrollLeft: 0,
				oldScrollLeft: 0,
				isFirst: {
					allRefs: true,
					strategyRefs : false,
					videoRefs : false,
					encycleRefs : false,
					imageRefs : false,
					userRefs : false,
					topicRefs : false,
					autorityRefs: false
				}
			};
		},
		methods: {
			init(keyWord) {
				this.loading = true
				this.keyWord = keyWord
				this.$refs.allRefs.initData(this.keyWord)
			},
			tabItemClick(index) {
				this.current = index
				const arr = [3,4,5,6]
				if(arr.includes(index)) {
					const scroll = (index - 3 ) * 60
					this.scrollLeft = this.oldScrollLeft
					this.$nextTick(function() {
						this.scrollLeft = scroll
					});
				}
				const ref = this.switchRefs(index)
				if(!this.isFirst[ref]) {
					this.isFirst[ref] = true
					this.$refs[ref].initData(this.keyWord)
				}
			},
			swiperChange(event) {
				const index = event.detail.current
				this.current = index
				const arr = [3,4,5,6]
				if(arr.includes(index)) {
					const scroll = (index - 3 ) * 60
					this.scrollLeft = this.oldScrollLeft
					this.$nextTick(function() {
						this.scrollLeft = scroll
					});
				}
				const ref = this.switchRefs(index)
				if(!this.isFirst[ref]) {
					this.isFirst[ref] = true
					this.$refs[ref].initData(this.keyWord)
				}
			},
			tabSwiper(event) {
				const scroll = event.detail.scrollLeft
				this.oldScrollLeft = scroll
			},
			switchRefs(index) {
				let ref = ''
				switch (index) {
					case 0:
						ref = 'allRefs';
					break;
				  case 1:
				    ref = 'strategyRefs';
				    break;
				  case 2:
					ref = 'videoRefs';
				    break;
				  case 3:
					  ref = 'encycleRefs';
					break;
				   case 4:
						ref = 'imageRefs';
					break;
					case 5:
						ref = 'userRefs';
						break;
					case 6:
						ref = 'topicRefs';
					break;
					case 7:
						ref = 'autorityRefs';
					break;
				}
				
				return ref
			},
		},
		computed: {
			...mapState(['windowHeight','rpxNum'])
		},
	}
</script>

<style lang="scss" scoped>
.searchPostContent{
	width: 750rpx;
	height: 100vh;
	position: absolute;
	top: 0;
	left: 0;
	background: #fff;
	z-index: 10;

	.tab{
		background: #f8f8f8;
		padding: 20rpx 24rpx 0;
		position: absolute;
		top: 98rpx;
		left: 0;
		width: 702rpx;
		/* #ifdef MP-WEIXIN */
		top: 168rpx;
		/* #endif */
		
		.tabWrap{
			display: flex;
			
			.tabItem{
				padding-bottom: 20rpx;
				position: relative;
				margin-right: 76rpx;
				font-size: 30rpx;
				color: #999;
				
				&:last-of-type{
					margin-right: 0;
				}
				
				&.active{
					color: #000;
					
					&::after{
						content: '';
						display: block;
						height: 4px;
						width: 30rpx;
						border-radius: 4px;
						background: #71e0fe;
						position: absolute;
						bottom: 0;
						left: 12rpx;
					}
				}
			}
		}
	}
	
	.swiperContent{
		padding-top: 178rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 258rpx;
		/* #endif */
		box-sizing : border-box;
		width: 750rpx;
	}
}
</style>