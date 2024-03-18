<template>
	<scroll-view class="itemContent" :scroll-y="true" @scroll="surveyScrollEvent" 
		ref="surveyScroll" :scroll-top="scrollTop" :scroll-with-animation='true'>
	<view v-if="!pageLoading">
		<view class="searchAndCatalog">
			<view class="search">搜索观测枢</view>
			<view class="notice"></view>
			<view class="catalog"></view>
		</view>
		<view  v-if="topBanner.length > 0" >
			<banner :topBanner="topBanner" ref="swiperBanner"></banner>
		</view>
		<view  v-if="mapShowData.length > 0">
			<survey-catalogicon :mapShowData="mapShowData" ref="mapIcon"></survey-catalogicon> 
		</view>
		<view  v-if="hotRecommendData.list && hotRecommendData.list.length > 0">
			<hot-recommend ref="hotRecommend" :hotRecommendData="hotRecommendData"></hot-recommend>
		</view>
		
		<view v-if="gameplayExplorationShowData && gameplayExplorationShowData.length > 0" >
			<game-play :gameplayExplorationShowData="gameplayExplorationShowData" ref="gameplay"></game-play>
		</view>
		<view v-if="cardGroupWalkthroughData.children && cardGroupWalkthroughData.children.length > 0">
			<card-group :cardGroupData="cardGroupWalkthroughData"></card-group>
		</view>
		
		<view v-if="NPC_challenge_data.children && NPC_challenge_data.children.length > 0">
			<npc-challenge :challengeData="NPC_challenge_data"></npc-challenge>
		</view>

		<view v-if="latestContentData.children && latestContentData.children.length > 0">
			<latest-content :latestData="latestContentData"></latest-content>
		</view>
		<view v-if="videoWalkthroughData.children && videoWalkthroughData.children.length > 0">
			<video-walkthrough :videoData="videoWalkthroughData"></video-walkthrough>
		</view>
		<view v-if="fanContentData.children && fanContentData.children.length > 0">
			<fan-content :fanData="fanContentData"></fan-content>
		</view>
		<view v-if="indexSortData.children && indexSortData.children.length > 0">
			<index-sort :sortData="indexSortData"></index-sort>
		</view>
		
		<view class="page_bottom">
			
			<view class="bottom_nav">
				<view class="nav_items after">
					申请观测枢编辑
				</view>
				<view class="nav_items after">
					关于观测枢
				</view>
				<view class="nav_items">
					建议与反馈
				</view>
			</view>
			
			<image src="../../static/survey/surveyBottomImg.png" mode="aspectFill" class="image"></image>
		</view>
		
		<view class="to_top" v-if="to_top_show" @tap.stop="toTop">
			<image src="../../static/survey/run_top.png" mode="aspectFill" class="image"></image>
		</view>
	</view>
		<u-loading-page :loading="pageLoading" loadingText=" " iconSize="60"></u-loading-page>
	</scroll-view>
</template>

<script>
	import {surveyBannerApi,surveyMapApi} from '../../common/api.js'
	import Banner from '../../components/survey/banner.vue'
	import SurveyCatalogicon from '../../components/survey/surveyCatalogicon.vue'
	import HotRecommend from '../../components/survey/hotRecommend.vue'
	import GamePlay from '../../components/survey/gamePlay.vue'
	import CardGroup from '../../components/survey/cardGroup.vue'
	import NpcChallenge from '../../components/survey/npcChallenge.vue'
	import VideoWalkthrough from '../../components/survey/videoWalkthrough.vue'
	import LatestContent from '../../components/survey/latestContent.vue'
	import FanContent from '../../components/survey/fanContent.vue'
	import IndexSort from '../../components/survey/indexSort.vue'
	  
	export default {
		name:"survey",
		components: {
			Banner,
			SurveyCatalogicon,
			HotRecommend,
			GamePlay,
			CardGroup,
			NpcChallenge,
			VideoWalkthrough,
			LatestContent,
			FanContent,
			IndexSort
		},
		data() {
			return {
				topBanner: [],
				current: 0,
				mapData: {},
				mapShowData: {},
				hotRecommendData:  {},
				gameplayExplorationData:  {},
				gameplayExplorationShowData:  [],
				cardGroupWalkthroughData:  {},
				NPC_challenge_data:  {},
				latestContentData:  {},
				videoWalkthroughData:  {},
				themeRecommendData:  {},
				selectGuideData: {},
				fanContentData: {},
				cardGroupVideoData: {},
				indexSortData: {},
				tournamentInterviewData: {},
				sevenSacredData: {},
				gameSwiperOption: {
					slidesPerView : 1.3,
					spaceBetween: 10
				},
				to_top_show: false,
				scrollTop: 0,
				oldScrollTop: 0,
				pageLoading: true
			};
		},
		methods: {
			async getSurveyBanner() {
				const {data: res} = await surveyBannerApi()
				this.topBanner = res.data.list
			},
			async getSurveyMap() {
				const {data: res} = await surveyMapApi()
				const list = this.resetData(res.data.list)
				if(this.pageLoading) {
					this.pageLoading = false
				}
				this.mapData = list[0]
				this.mapShowData = list[0].children.slice(0,7)
				this.hotRecommendData = list[1]
				this.gameplayExplorationData = list[2]
				this.gameplayExplorationShowData = list[2].children.slice(0,4)
				this.cardGroupWalkthroughData = list[3]
				this.NPC_challenge_data = list[4]
				this.latestContentData = list[5]
				this.videoWalkthroughData = list[6]
				this.themeRecommendData = list[7]
				this.selectGuideData = list[8]
				this.fanContentData = list[9]
				this.cardGroupVideoData = list[10]
				this.indexSortData = list[11]
				this.tournamentInterviewData = list[12]
				this.sevenSacredData = list[13]
			},

			resetData(arr) {
				for(let i = 0; i < arr.length; i ++) {
					if(arr[i].ch_ext) {
						const arrjson = JSON.parse(arr[i].ch_ext)
						arr[i].ch_ext = arrjson[2]
						if(arr[i].children.length > 0) {
							arr[i].children = this.resetData(arr[i].children)
						}
					}
				}
				return arr
			},
			tochMoveStop(event) {
				event.stopPropagation();
			},
			surveyScrollEvent(e) {
				this.oldScrollTop = e.detail.scrollTop
				if(e.detail.scrollTop > 800) {
					this.to_top_show = true
				}else{
					this.to_top_show = false
				}
			},
			toTop() {
				  // 获取 scroll-view 组件
				 //  const scrollView = this.$refs.surveyScroll;
				 //  // 使用uni.createSelectorQuery获取 scroll-view 的实例
				 //  uni.createSelectorQuery().in(this).select('#surveyScroll').scrollOffset(function(res) {
					// // 设置 scrollTop 到顶部
					// scrollView.scrollTop = 0;
				 //  }).exec();
				  this.scrollTop = this.oldScrollTop
				  this.$nextTick(function() {
					  this.scrollTop = 0
				  })
				  this.to_top_show = false
			}
		},
		created() {
			this.getSurveyBanner()
			this.getSurveyMap()
		}
	}
</script>

<style lang="scss">
	.itemContent{
		height: 100%;
		
		.searchAndCatalog{
			display: flex;
			align-items: center;
			padding: 20rpx 32rpx;
			box-sizing: border-box;
			justify-content: space-between;
			
			.search{
				width: 366rpx;
				height: 36px;
				line-height: 36px;
				padding-left: 36px;
				box-sizing: border-box;
				background-image: url('../../static/survey/search.png');
				background-position: 10px 10px;
				background-size: 16px 16px;
				color: #d9d9d9;
				background-color: #f5f5f5;
				background-repeat: no-repeat;
				font-size: 12px;
				border-radius: 6px;
			}
			
			.notice{
				width: 140rpx;
				height: 36px;
				background-image: url('../../static/survey/notice.png');
				background-repeat: no-repeat;
				background-size: 140rpx 36px;
				background-position: 0 0;
			}
			
			.catalog{
				width: 148rpx;
				height: 36px;
				background-image: url('../../static/survey/catalog.png');
				background-repeat: no-repeat;
				background-size: 148rpx 36px;
				background-position: 0 0;
			}
		}
		
		.page_bottom{
			padding: 20px 32rpx;
			
			.bottom_nav{
				font-size: 26rpx;
				display: flex;
				justify-content: center;
				color: #4696db;
				margin-bottom: 30px;
				line-height: 52rpx;
				
				.nav_items{
					&.after::after{
						content: '';
						display: inline-block;
						vertical-align: middle;
						width: 16rpx;
						height: 16rpx;
						margin: 18rpx;
						transform: rotate(45deg);
						transform-origin: 50% 50%;
						background: #f0f0f0;
					}
				}
			}
			
			.image{
				width: 686rpx;
				height: 182rpx;
			}
		}
		
		.to_top{
			position: fixed;
			right: 32rpx;
			bottom: 150rpx;
			
			.image{
				width: 136rpx;
				height: 136rpx;
			}
		}
	}
</style>