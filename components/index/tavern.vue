<template>
	<scroll-view class="itemContent" @scroll="scroll" @scrolltolower="scrollBottom"
			:refresher-triggered="scrollMessage.refresherTrg"  :scroll-y="scrollMessage.scrollY"
			:refresher-enabled="scrollMessage.refresherAble" 
			@refresherpulling="scrollPull" :refresher-threshold="100" >
		<view class="content"  :style="{'padding-top': indexChangePadding}" v-if="!pageLoading">
			<top-posts-list :topPosts="topPosts"></top-posts-list>
			
			<view class="sortSelect">
				<view class="sortRight" @tap.stop="openSortSelect">
					<view class="endingSort">
						{{sort.name}}
					</view>
					<u-icon name="arrow-down" color="#ddd" size="20"></u-icon>
				</view>
				<view class="sortLeft">
					排序
				</view>
			</view>
			<view class="consultDiscover" v-if="tavernPostList.length">
				<view class="consultDiscoverItem" v-for="(item,index) in tavernPostList" :key="item.post.post_id">
					<PostItems :item="item"></PostItems>
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
import {tavernHotTopicsApi,tavernPostListApi} from '../../common/api.js'
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
					name: '默认'
				},
				tavernPostList: [],
				scrollMessage: {
					refresherTrg: false,
					refresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				timer: null,
				pageLoading: true
			};
		},
		computed: {
			...mapState(['tabChangeTop','isFixed','swiperChangeHeight','indexChangePadding',"swiperHeight","tabSwiperScrollTop"]),
		},
		methods: {
			...mapMutations(['updateScrollProp','swiperChange']),
			async getTavernHotTopics() {
				const {data:res} = await tavernHotTopicsApi()
				this.topPosts = res.data.top_posts
				this.topics = res.data.topics
				this.sortConfig = res.data.forum_sort_config
			},
			async getTavernPostList(page=1,sort_type=1,page_size=20, callBack) {
				const {data:res} = await tavernPostListApi(page,page_size,sort_type)
				if(this.pageLoading) {
					this.pageLoading = false
				}
				const list = res.data.list
				this.tavernPostList = list
				if(callBack) callBack()
			},
			async updateTavernPostList(page,sort_type,page_size=20) {
				const {data:res} = await tavernPostListApi(page,page_size,sort_type)
				const list = res.data.list
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
				this.updateTavernPostList(2,1)
			},
			scrollPull(e) {
				if(e.detail.deltaY < 0) {
					return
				}
				if(e.detail.deltaY > 120) {
					if(this.scrollMessage.loadingEnd) return
					this.scrollMessage.loadingEnd = true
					this.scrollMessage.refresherTrg = true
					this.getTavernPostList(1,1,20,() => {
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
				uni.$emit('openWrap',this.sortConfig,x,y,'T')
			}
		},
		created() {
			this.getTavernHotTopics()
			this.getTavernPostList()
		},
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
			}
		}
	}
</style>