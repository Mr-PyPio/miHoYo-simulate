<template>
	<scroll-view class="itemContent" @scroll="scroll" @scrolltolower="scrollBottom"
			:refresher-triggered="scrollMessage.refresherTrg"  :scroll-y="scrollMessage.scrollY"
			:refresher-enabled="scrollMessage.refresherAble" 
			@refresherpulling="scrollPull" :refresher-threshold="100" >
		<view class="content"  :style="{'padding-top': indexChangePadding}" v-if="!pageLoading">
			<view class="top_tab" v-if="topTabList.length">
				<view v-for="(item,index) in topTabList" :key="index"  class="tab_items">
					<image :src="item.icon" mode="aspectFill" class="image"></image>
					<view class="tab_name">
						{{item.name}}
					</view>
				</view>
			</view>
			
			<top-posts-list :topPosts="topPosts"></top-posts-list>
			
			<view class="sortSelect">
				<view class="sortRight" @tap.stop="openSortSelect">
					<view class="endingSort">
						{{sort.name}}
					</view>
					<u-icon name="arrow-down" color="#ddd" size="20"></u-icon>
				</view>
			</view>
			<view class="consultDiscover" v-if="tavernPostList.length">
				<view class="consultDiscoverItem" v-for="(item,index) in tavernPostList" :key="item.post.post_id">
					<PostItems :item="item"></PostItems>
					<view v-if="index === 2 && swiperBanner.length > 0" class="swiper_banner">
						<swiper :display-multiple-items="2" :style="{'height': '158rpx'}">
							<swiper-item v-for="(banner,bannerIndex) in swiperBanner" :key="bannerIndex">
								<image :src="banner.image_url" mode="aspectFill" class="image"></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			
			<view class="loading">
				<u-loading-icon mode="circle" size="42"></u-loading-icon>
			</view>
		</view>
		<u-loading-page :loading="pageLoading" loadingText=" " iconSize="60"></u-loading-page>
	</scroll-view>
</template>

<script>
import {strategyTopTabApi,strategyTopPostApi,strategyPostList} from '../../common/api.js'
import PostItems from '../common/postItems.vue'
import TopPostsList from '../common/topPostsList.vue'
import {mapState,mapGetters,mapMutations} from "vuex"
	export default {
		name:"tavern",
		components: {
			PostItems,
			TopPostsList
		},
		data() {
			return {
				topPosts: [],
				topics: [],
				sortConfig: [],
				sort: {
					show_sort: 1,
					name: '默认',
					sort_type: 5,
					page: 1
				},
				tavernPostList: [],
				scrollMessage: {
					refresherTrg: false,
					refresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				timer: null,
				topTabList: [],
				swiperBanner: [],
				pageLoading: true
			};
		},
		computed: {
			...mapState(['tabChangeTop','isFixed','swiperChangeHeight','indexChangePadding',"swiperHeight","tabSwiperScrollTop"]),
		},
		methods: {
			...mapMutations(['updateScrollProp','swiperChange']),
			async getStrategyTopTabApi() {
				const {data:res} = await strategyTopTabApi()
				this.topTabList = res.data.navigators
				if(this.pageLoading) {
					this.pageLoading = false
				}
			},
			async getStrategyTopPost() {
				const {data:res} = await strategyTopPostApi()
				this.topPosts = res.data.top_posts
				this.topics = res.data.topics
				this.sortConfig = res.data.forum_sort_config
				this.swiperBanner = res.data.banners
			},
			async getStrategyPostList(page,sort_type,page_size, callBack) {
				const {data:res} = await strategyPostList(page,page_size,sort_type)
				let list
				if(sort_type === 5) {
					list = res.data.posts
				}else{
					list = res.data.list
				}
				this.tavernPostList = list
				if(callBack) callBack()
			},
			async updateStrategyPostList(page,sort_type,page_size=20) {
				const {data:res} = await strategyPostList(page,page_size,sort_type)
				let list
				if(sort_type === 5) {
					list = res.data.posts
				}else{
					list = res.data.list
				}
				const newList = list
				this.tavernPostList.push(...newList)
			},
			scroll(e) {
				// if(this.swiperHeight) {
				// 	const top = e.detail.scrollTop
				// 	this.updateSwiperScrollTop(top)
				// 	this.updateScrollProp(top)
				// }
			},
			scrollBottom() {
				this.sort.page += 1
				this.updateStrategyPostList(this.sort.page,this.sort.sort_type)
			},
			scrollPull(e) {
				if(e.detail.deltaY < 0) {
					return
				}
				if(e.detail.deltaY > 120) {
					if(this.scrollMessage.loadingEnd) return
					this.scrollMessage.loadingEnd = true
					this.scrollMessage.refresherTrg = true
					this.getStrategyPostList(1,5,20,() => {
						this.scrollMessage.refresherTrg = false
						this.scrollMessage.loadingEnd = false
					})
				}
			},
			updateSwiperScrollTop(top) {
				if(this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					this.swiperChange(top)
				}, 500)
			},
			openSortSelect(e) {
				const x = 15
				const y = e.detail.y
				uni.$emit('openWrap',this.sortConfig,x,y,'S')
			}
		},
		created() {
			this.getStrategyTopTabApi()
			this.getStrategyTopPost()
			this.getStrategyPostList(1,5,20)
		}
	}
</script>

<style lang="scss" scoped>
	.itemContent{
		height: 100%;
	}
	.content {
		.loading{
			display: flex;
			justify-content: center;
			padding: 40rpx 0;
		}
		
		.top_tab{
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding-bottom: 40rpx;
			padding-top: 20rpx;
			border-bottom: 1px solid #f8f8f8;
			
			.tab_items{
				display: flex;
				width: 20%;
				justify-content: center;
				flex-wrap: wrap;
				
				.image{
					width: 80rpx;
					height: 80rpx;
					margin: 0 auto;
				}
				
				.tab_name{
					display: block;
					font-size: 22rpx;
					padding-top: 8rpx;
				}
			}
		}
		
		.top_posts{
			margin-top: 0;
			border: 0;
			padding-bottom: 0;
		}
		
		.sortSelect{
			padding: 24rpx;
			display: flex;
			justify-content: space-between;
			color: #ddd;
			font-size: 20rpx;
			align-items: center;
			border-bottom: 6px solid #f8f8f8;
			
			.sortRight{
				display: flex;
				align-items: center;
				
				.endingSort{
					margin-right: 4px;
				}
			}
		}
		.consultDiscover{
			.consultDiscoverItem{
				border-bottom: 6px solid #f8f8f8;
				background: #fff;

				.swiper_banner{
					padding: 0 24rpx;
					height: 158rpx;
					box-sizing: content-box;
					padding: 20rpx;
					border-top:  6px solid #f8f8f8;
					border-radius: 8px;
					
					.image{
						width: 340rpx;
						height: 158rpx;
						border-radius: 8px;
					}
				}
			}
		}
	}
</style>