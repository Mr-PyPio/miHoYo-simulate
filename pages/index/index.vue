<template>
	<view class="content">
		<view class="top_nav" ref="topNav">
			<image v-if="topTabBackground" :src="topTabBackground.image" mode="aspectFill" class="backgroungImage"></image>
			<view class="indexTop">
				<view class="top_left">
					原神
				</view>
				<view class="top_search">
					<image src="../../static/search.png" mode="aspectFill" @tap.stop="goToSearch"></image>
				</view>
			</view>
			<view class="swiper_nav" >
				<swiper display-multiple-items="5.5" v-if="topTabNav.length > 0" :style="{'height': '110rpx'}">
					<swiper-item v-for="item in topTabNav" :key="item.id"> 
						<view class="swiper-item">
							<view class="swiper-image">
								<image :src="item.icon|imageUrlReset(60,80)" mode="aspectFill"></image>
							</view>
							<text align="center">{{item.name}}</text>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="message_content" v-if="tabSetting">
			<view class="message_tab" ref="messageTabRef">
			   <view class="message_tab_2" >
					<view class="isFixedBg">
						<scroll-view :scroll-x="true" style="white-space: nowrap;" @scroll="tabSwiper"
						:scroll-left="tabSetting.scrollLeft" :scroll-with-animation="true">
							<view class="tabWrap">
								<view class="tabItem" :class="{'active': index === tabSetting.current}" v-for="(item,index) in tabSetting.tabList" 
								 @tap.stop="tabItemClick(index)"  :key="index">
									{{item}}
								</view>
							</view>
						</scroll-view>
					</view>
			   </view>
			</view>
			<view class="swiper_auto_height" :style="{'height' : swiperHeight}">
				  <swiper :current="tabSetting.current"  @change="swiperAnimationfinish"  :style="{'height' : swiperHeight}"
						v-if="consultData.length" ref="tabSwiperRef" >
						<swiper-item class="swiper-item">
							<IndexSurvey v-if="surveyShow"  ref="indexsurvey"></IndexSurvey>
						</swiper-item>
						<swiper-item class="swiper-item" v-if="hotTopics.length" >
							<IndexFind :hotTopics="hotTopics" :consultData="consultData" ref="indexfind"></IndexFind>
						</swiper-item> 
						<swiper-item class="swiper-item"  >
							<index-authority ref="indexAuthority" v-if="authorityShow"></index-authority>
						</swiper-item> 
						<swiper-item class="swiper-item" >
							<IndexTavern ref="indexTavern" v-if="tavernShow"></IndexTavern>
						</swiper-item>
						<swiper-item class="swiper-item" >
							<IndexStrategy ref="indexStrategy" v-if="strategyShow"></IndexStrategy>
						</swiper-item>
						<swiper-item class="swiper-item">
							<IndexFanArt ref="indexFanArt" v-if="fanArtShow"></IndexFanArt>
						</swiper-item>
						<swiper-item class="swiper-item" >
							<IndexCos ref="indexCos" v-if="cosShow"></IndexCos>
						</swiper-item>
						<swiper-item class="swiper-item">
							<IndexHardCore ref="indexHardCore" v-if="hardCoreShow"></IndexHardCore>
						</swiper-item>
				  </swiper>
			  </view>
		</view>
		<view class="fixWrapp" v-show="fixWrappShow" @tap.prevent="tapFixWrapper">
			<view class="sortSelectlList" v-if="wrapSort.sortSelect.length > 0" 
			 :style="{'top':`${wrapSort.sortListTop}px`,'left': `${wrapSort.sortListLeft}px`}">
				<view class="sortSelectItem" v-for="(sort,index) in wrapSort.sortSelect" :key="index" 
				@tap.stop="sortTap(sort.show_sort,sort.name,sort.type)" :class="{'active': activeSort(sort.show_sort)}">
					{{sort.name}}
				</view>
			</view>
		</view>
		<view class="imgFixWrapp" v-if="imgFixWrappShow" @tap.prevent="tapImgFixWrapper">
			<img-pop-up :data = "imgList" :index='imgShowIndex'></img-pop-up>
		</view>
	</view>
</template>

<script>
	import IndexFind from '@/components/index/find.vue'
	import IndexAuthority from '@/components/index/authority.vue'
	import IndexCos from '@/components/index/cos.vue'
	import IndexHardCore from '@/components/index/hardcore.vue'
	import IndexTavern from '@/components/index/tavern.vue'
	import IndexSurvey from '@/components/index/survey.vue'
	import IndexFanArt from '@/components/index/fan_art.vue'
	import IndexStrategy from '@/components/index/strategy.vue'
	import {getHomeNew} from "../../common/api.js"
	import ImgPopUp from '@/components/common/imgPopUp.vue'
export default {
	components: {
		IndexFind,
		IndexAuthority,
		IndexCos,
		IndexHardCore,
		IndexTavern,
		IndexSurvey,
		IndexFanArt,
		IndexStrategy,
		ImgPopUp
	},
	computed: {
		swiperHeight() {
			return this.windowHeight * this.rpxNum - 330 + 'rpx'
		}
	},
	data() {
		return {
			topTabData: null,
			topTabBackground: null,
			topTabNav: {},
			// tab配置
			tabSetting: {
				current: 1,
				tabList: ['观测枢','发现','官方','酒馆','攻略','同人图','COS','硬核'],
				scrollLeft: 0,
				oldScrollLeft: 0
			},
			consultData: [],
			hotTopics: [],
			wrapSort: {
				sortSelect: [],
				showSort: 1,
				sortListTop:0,
				sortListLeft: 0,
				wrapType: 'T'
			},
			authorityShow: false,
			fixWrappShow: false,
			surveyShow: false,
			tavernShow: false,
			strategyShow: false,
			fanArtShow: false,
			cosShow: false,
			hardCoreShow: false,
			imgFixWrappShow: false,
			imgList: [],
			imgShowIndex: 0,
			windowHeight: 0
		}
	},
	onLoad() {
		this.getIndexTopTab()
		this.getIndexConsult()
		uni.$on('openWrap',(data,x,y,type = 'T') => {
			this.wrapSort.sortListTop = y + 15
			this.wrapSort.sortListLeft = x
			this.wrapSort.sortSelect = data
			this.wrapSort.wrapType = type
			this.fixWrappShow = true
		})
		uni.$on('openImgPopUp',(list,index) => {
			this.imgList = list
			this.imgShowIndex = index
			this.imgFixWrappShow = true
		})
		uni.$on('changeTab',(index) => {
			this.tabItemClick(index)
		})
		uni.getSystemInfo({
			success: res => {
				const rpxNum = 750 / res.windowWidth
				this.rpxNum = rpxNum
				this.windowHeight = res.windowHeight
			}
		})
	},
	methods: {
		async getIndexTopTab(){
			const res = await getHomeNew('1,3,4')
			const data = res.data.data
			this.topTabData = data
			this.topTabBackground = data.background
			this.topTabNav = data.navigator
			console.log(data)
		},
		async getIndexConsult() {
			const res = await getHomeNew('4,6,7,8,9')
			const data = res.data.data
			console.log(data)
			this.consultData = data.official.data
			this.hotTopics = data.hot_topics.data
		},
		//swiper滑动结束
		swiperAnimationfinish(e) {		
			const index =  e.detail.current
			this.transitionTab(index)
			this.swichIndexRequest(index)
			this.tabSetting.current = index;
		},
		tabSwiper(event) {
			const scroll = event.detail.scrollLeft
			this.tabSetting.oldScrollLeft = scroll
		},
		sortTap(value,name,sort_type) {
			const type = this.wrapSort.wrapType
			console.log(value,name,type)
			if(value != this.wrapSort.showSort) {
				this.wrapSort.showSort = value
				if(type === 'T') {
					this.$refs.indexTavern.sort.show_sort = value
					this.$refs.indexTavern.sort.name = name
					this.$refs.indexTavern.sort.page = 1
					this.$refs.indexTavern.sort.sort_type = sort_type
					this.$refs.indexTavern.getTavernPostList(1,value,20)
				}
				if(type === 'S') {
					this.$refs.indexStrategy.sort.show_sort = value
					this.$refs.indexStrategy.sort.name = name
					this.$refs.indexTavern.sort.page = 1
					this.$refs.indexStrategy.sort.sort_type = sort_type
					this.$refs.indexStrategy.getStrategyPostList(1,sort_type,20)
				}
				if(type === 'F' || type === 'C' || type === 'H') {
					let refObj
					if(type === 'F') {
						refObj = this.$refs.indexFanArt
					}
					if(type === 'C') { 
						refObj = this.$refs.indexCos
					}
					if(type === 'H') {
						refObj = this.$refs.indexHardCore
					}
					refObj.sort.show_sort = value
					refObj.sort.name = name
					refObj.sort.page = 1
					refObj.sort.sort_type = sort_type
					refObj.sort.is_hot = false
					if(value === 3) {
						refObj.sort.is_hot = true
						refObj.sort.sort_type = 1
						refObj.getForumPostList(1,20,1,true)
					}else {
						refObj.getForumPostList(1,20,sort_type,false)
					}
				}
			}
			this.fixWrappShow = false
		},
		activeSort(sort) {
			return Number(this.wrapSort.showSort) === Number(sort)
		},
		tapFixWrapper() {
			this.fixWrappShow = false
		},
		swichIndexRequest(value) {
			switch(value) {
				case 0:
					this.surveyShow = true;
					break;
				case 2:
					this.authorityShow = true;
					break;
				case 3:
					this.tavernShow = true;
					break;
				case 4:
					this.strategyShow = true;
					break;
				case 5:
					this.fanArtShow = true;
					break;
				case 6:
					this.cosShow = true;
					break;
				case 7:
					this.hardCoreShow = true;
					break;
			}
		},
		tapImgFixWrapper() {
			this.imgFixWrappShow = false
			this.imgShowIndex = 0
			this.imgList = []
		},
		goToSearch() {
			uni.navigateTo({
				url: `/subPackages/search/search`
			});
		},
		tabItemClick(index) {
			this.current = index
			this.tabSetting.current = index;
			this.transitionTab(index)
			this.swichIndexRequest(index)
		},
		transitionTab(index) {
			const arr = [3,4,5,6]
			const arr2 = [0,1,2]
			if(arr.includes(index)) {
				const scroll = (index - 3 ) * 60
				this.tabSetting.scrollLeft = this.tabSetting.oldScrollLeft
				this.$nextTick(function() {
					this.tabSetting.scrollLeft = scroll
				});
			}
			if(arr2.includes(index)) {
				this.tabSetting.scrollLeft = this.tabSetting.oldScrollLeft
				this.$nextTick(function() {
					this.tabSetting.scrollLeft = 0
				});
			}
		}
	},
	mounted() {
		
	}
}
</script>

<style lang="scss" scoped>
	.content{
		box-sizing: border-box;
		
		.backgroungImage{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			height: 300rpx;
		}
		
		.indexTop{
			display: flex;
			justify-content: space-between;
			height: 60rpx;
			padding: 20rpx 24rpx;
			align-items: center;	
				
			.top_left{
				font-size: 36rpx;
				color: #fff;
			}
			
			.top_search{
				display: flex;
				align-items: center;
				
				image{
					width: 48rpx;
					height: 48rpx;
				}
			}
		}

		
		.top_nav{
			overflow: hidden;
			.swiper_nav{
				height: 110rpx;
				padding: 20rpx 0;
				background-color: transparent;
				
				uni-swiper{
					height: 110rpx;
				}
				
				.swiper-item{
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					
					.swiper-image{
						image{
							width: 60rpx;
							height: 60rpx;
						}
					}
					
					text{
						font-size: 22rpx;
						display: block;
						width: 100%;
						text-align: center;
						color: #fff;
					}
				}
			}
		}
		.message_content{
			width: 100%;
			background: transparent;
			
			.message_tab{
				height: 80rpx;
				overflow: hidden;
				position: relative;
				
				.isFixed{
					position: fixed;
					left: 0;
					top: var(--window-top);
					z-index: 10;
					width: 100%;
				}
					
				.isFixedBg{
					border-top-right-radius: 26rpx;
					border-top-left-radius: 26rpx;
					overflow: hidden;
					background: #fff;
					
					.tabWrap{
						display: flex;
						
						.tabItem{
							position: relative;
							padding:12rpx 30rpx;
							font-size: 30rpx;
							color: #999;
							
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
									left: 50%;
									transform: translateX(-50%);
								}
							}
						}
					}
				}
			}
			
			.swiper_auto_height{
				/*  #ifdef MP-WEIXIN */
				height: calc(100vh -  40px - 125px);
				overflow: unset !important;
				/* #endif */ 
				/*  #ifdef WEB */
				height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top) - 40px - 125px);
				overflow: unset !important;
				/* #endif */ 
				position: relative;
			}
			
			swiper{
				/*  #ifdef MP-WEIXIN */ 
				height: calc(100vh -  40px - 125px);
				overflow: unset !important;
				/* #endif */ 
				/*  #ifdef WEB */
				height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top) - 40px - 125px);
				overflow: unset !important;
				/* #endif */ 
				position: absolute;
				bottom: 0;
				width: 100%;
			}
			.swiper-item{
				background: #fff;
				overflow: unset !important;
			}
		}
			
		.fixWrapp{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: 999;
			
			.sortSelectlList{
				position: absolute;
				background: #fff;
				width: 150rpx;
				padding: 0 24rpx;
				box-sizing: border-box;
				border-radius: 8px;
				
				.sortSelectItem{
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
		.imgFixWrapp{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 1);
			z-index: 999;
		}
	}
</style>