<template>
	<scroll-view class="itemContent" @scroll="scroll" @scrolltolower="scrollBottom"
			:refresher-triggered="scrollMessage.refresherTrg"  :scroll-y="scrollMessage.scrollY"
			:refresher-enabled="scrollMessage.refresherAble" 
			@refresherpulling="scrollPull">
		<view class="hardCoreContent" v-if="!pageLoading">
			<top-posts-list :topPosts="topPosts"></top-posts-list>
			
			<view class="sortSelect">
				<view class="sortRight" @tap.stop="openSortSelect">
					<view class="endingSort">
						{{sort.name}}
					</view>
					<u-icon name="arrow-down" color="#ddd" size="20"></u-icon>
				</view>
			</view>
			<view class="consultDiscover" v-if="postsListData.length">
				<view class="consultDiscoverItem" v-for="(item,index) in postsListData" :key="item.post.post_id">
					<PostItems :item="item"></PostItems>
					<view class="message_hotTips" v-if="index === 4">
						<view class="hotTipsTop">
							<text>大家都在聊</text>
							<view class="hotMore">
								<text>更多</text>
								<u-icon name="arrow-right" color="#ddd" size="20"></u-icon>
							</view>
						</view>
						<view class="hotTipsContent" v-if="hotTopics.length > 0">
							<view class="hotTopicsItem" v-for="(hot,key) in hotTopics" :key="key" v-if="key < 4">
								<image :src="hot.cover|imageUrlReset(100,80)" mode="aspectFill"></image>
								<view class="topicsDesc">
									<view class="topicsName">
										#{{hot.name}}
									</view>
									<view class="topicsDis">
										{{hot.reply_num}}人参与讨论
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>	
		<u-loading-page :loading="pageLoading" loadingText=" " iconSize="60"></u-loading-page>
	</scroll-view>
</template>

<script>
	import TopPostsList from '../common/topPostsList.vue'
	import {hardCoreMainApi,hardCorePostList} from '../../common/api.js'
	import PostItems from '../common/postItems.vue'
	export default {
		name:"hardcore",
		components: {
			TopPostsList,
			PostItems
		},
		data() {
			return {
				topPosts: [],
				hotTopics: [],
				sortConfig: [],
				sort: {
					show_sort: 1,
					name: '最新回复',
					page: 1,
					is_hot: false,
					sort_type: 1
				},
				scrollMessage: {
					refresherTrg: false,
					refresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				last_id: null,
				postsListData: [],
				pageLoading: true
			};
		},
		methods: {
			async getForumMain() {
				const {data: res} = await hardCoreMainApi()
				this.topPosts = res.data.top_posts
				this.sortConfig = res.data.forum_sort_config
				this.hotTopics = res.data.topics
			},
			async getForumPostList(page = 1,page_size = 20,sort_type = 1,is_hot = false,is_up = 0,callback) {
				let list = []
				this.scrollMessage.loadingEnd = true
				if(page > 1 && this.last_id) {
					const {data: res} = await hardCorePostList(page,page_size,sort_type,is_hot,this.last_id)
					list = res.data.list 
					this.last_id = res.data.last_id
				}else{
					const {data: res} = await hardCorePostList(page,page_size,sort_type,is_hot)
					list = res.data.list 
					this.last_id = res.data.last_id
				}
				if(is_up === 1) {
					this.postsListData.push(...list)
				}else{
					this.postsListData = list
					if(this.pageLoading) {
						this.pageLoading = false
					}
				}
				if(callback) {
					callback()
				}
				this.sort.page += 1
				this.scrollMessage.loadingEnd = false
			},
			openSortSelect(e) {
				const x = 15
				const y = e.detail.y
				uni.$emit('openWrap',this.sortConfig,x,y,'H')
			},
			scroll(e) {
				// if(this.swiperHeight) {
				// 	const top = e.detail.scrollTop
				// 	this.updateSwiperScrollTop(top)
				// 	this.updateScrollProp(top)
				// }
			},
			scrollBottom() {
				if(!this.scrollMessage.loadingEnd) {
					this.getForumPostList(this.sort.page,20,this.sort.sort_type,this.sort.is_hot,1)
				}
			},
			scrollPull(e) {
				if(e.detail.deltaY < 0) {
					return
				}
				if(this.scrollMessage.loadingEnd) return
				this.scrollMessage.loadingEnd = true
				this.scrollMessage.refresherTrg = true
				this.getForumPostList(1,20,this.sort.sort_type,this.sort.is_hot,0,() => {
					this.scrollMessage.refresherTrg = false
					this.scrollMessage.loadingEnd = false
				})
			},
		},
		created() {
			this.getForumMain()
			this.getForumPostList()
		}
	}
</script>

<style lang="scss" scoped>
	.itemContent{
		height: 100%;
	}
.hardCoreContent{
	.top_posts{
		border-top: 0;
		padding-top: 0;
	}
	.consultDiscover{
		.consultDiscoverItem{
			border-bottom: 6px solid #f8f8f8;
			background: #fff;
			
			
			.message_hotTips {
				border-top: 6px solid #f8f8f8;
				padding: 24rpx 24rpx 0;
				
				.hotTipsTop{
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #000;
					justify-content: space-between;
					padding: 12rpx 0 ;
					
					
					.hotMore{
						display: flex;
						align-items: center;
						font-size: 20rpx;
						color: #ddd;
					}
				}
				
				.hotTipsContent{
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					
					.hotTopicsItem{
						width: 50%;
						display: flex;
						align-items: center;
						padding: 12rpx 0;
						
						image{
							width: 64rpx;
							height: 64rpx;
							border-radius: 6px;
							margin-right: 16rpx;
						}
						
						.topicsDesc{
							width: calc(100% - 76rpx);
							color: #000;
							font-size: 24rpx;		
												
							.topicsDis{
								font-size: 20rpx;
								color: #ddd;
							}
						}
						
	
					}
				}
			}
		}
	}
	.sortSelect{
		padding: 0 24rpx 8px;
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
}
</style>