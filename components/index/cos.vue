<template>
<scroll-view class="itemContent" @scroll="scroll" @scrolltolower="scrollBottom"
			:refresher-triggered="scrollMessage.refresherTrg"  :scroll-y="scrollMessage.scrollY"
			:refresher-enabled="scrollMessage.refresherAble" 
			@refresherpulling="scrollPull">
	<view class="cosContent" v-if="!pageLoading">
		<view class="topNoWrapp">
			<view class="topNoTitle">
				COS榜
				<view class="more">
					更多
				</view>
			</view>
			<view class="topNoList"  @touchmove.stop="tochMoveStop" v-if="topNoListData.length">
				<swiper display-multiple-items="3">
					<swiper-item  v-for="(item,index) in topNoListData" :key="index" v-if="index < 3">
						<view class="topNoListItem">
							<view class="itemLogo" :style="{'backgroundImage': resetSrc(index)}">
							</view>
							<view class="itemImage">
								<image :src="item.cover.url|imageUrlReset(300,80)" mode="aspectFill" class="image"></image>
							</view>
							<view class="itemBotUser">
								<image :src="item.user.avatar_url" mode="aspectFill" class="userIcon"></image>
								<view class="userName">
									{{item.user.nickname}}
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
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
		
		<view class="forumPost" v-if="forumPostListLeft.length && forumPostListRight.length">
			<view class="forumPostListLeft">
				<view class="forumPostListItem" v-for="(item,index) in forumPostListLeft" :key="item.post.post_id">
					<forum-posts-list :item="item"></forum-posts-list>
				</view>
			</view>
			<view class="forumPostListRight">
				<view class="forumPostListItem" v-for="(item,index) in forumPostListRight" :key="item.post.post_id">
					<forum-posts-list :item="item"></forum-posts-list>
				</view>
			</view>
		</view>
	</view>
		<view class="loading">
			<u-loading-icon mode="circle" size="42"></u-loading-icon>
		</view>
		<u-loading-page :loading="pageLoading" loadingText=" " iconSize="60"></u-loading-page>
</scroll-view>
</template>

<script>
	import TopPostsList from '../common/topPostsList.vue'
	import ForumPostsList from '../common/forumPostsList.vue'
	import {cosTopNApi,cosMainApi,cosPostList} from '../../common/api.js'
	export default {
		name:"cos",
		components: {
			TopPostsList,
			ForumPostsList
		},
		data() {
			return {
				topNoListData: [],
				topPosts: [],
				sort: {
					show_sort: 1,
					name: '最新回复',
					page: 1,
					is_hot: false,
					sort_type: 1
				},
				sortConfig: [],
				forumPostListLeft: [],
				forumPostListRight: [],
				scrollMessage: {
					refresherTrg: false,
					refresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				last_id: null,
				pageLoading: true
			};
		},
		methods: {
			async getTopNoList() {
				const {data: res} = await cosTopNApi()
				this.topNoListData = res.data.list
			},
			async getForumMain() {
				const {data: res} = await cosMainApi()
				this.topPosts = res.data.top_posts
				this.sortConfig = res.data.forum_sort_config

			},
			async getForumPostList(page = 1,page_size = 20,sort_type = 1,is_hot = false,is_up = 0,callback) {
				let list = []
				this.scrollMessage.loadingEnd = true
				if(page > 1 && this.last_id) {
					const {data: res} = await cosPostList(page,page_size,sort_type,is_hot,this.last_id)
					list = res.data.list 
					this.last_id = res.data.last_id
				}else{
					const {data: res} = await cosPostList(page,page_size,sort_type,is_hot)
					list = res.data.list 
					this.last_id = res.data.last_id
				}
				if(is_up === 1) {
					this.forumPostListLeft.push(...list.slice(0,parseInt(list.length / 2)))
					this.forumPostListRight.push(...list.slice(parseInt(list.length / 2),list.length))
				}else{
					this.forumPostListLeft = list.slice(0,parseInt(list.length / 2))
					this.forumPostListRight = list.slice(parseInt(list.length / 2),list.length)				
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
			tochMoveStop(event) {
				event.stopPropagation();
			},
			openSortSelect(e) {
				const x = 15
				const y = e.detail.y
				uni.$emit('openWrap',this.sortConfig,x,y,'C')
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
			resetSrc(index) {
				return `url('../../static/cosNo${index+1}.png')`
			}
		},
		created() {
			this.getTopNoList()
			this.getForumMain()
			this.getForumPostList()
		}
	}
</script>

<style lang="scss" scoped>
.itemContent{
	height: 100%;
}
.loading{
	display: flex;
	justify-content: center;
	padding: 40rpx 0;
	background: #f8f8f8;
}
.cosContent{
	.topNoWrapp{
		.topNoTitle{
			padding: 0 24rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #000;
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			position: relative;
			box-sizing: border-box;
			
			.more{
				position: absolute;
				right: 24rpx;
				top: 50%;
				transform: translateY(-50%);
				font-size: 22rpx;
				color: #b1968b;
				padding-right: 12px;
				background-image: url("../../static/survey/right_icon.png");
				background-size: auto 8px;
				background-position: right 66%;
				background-repeat: no-repeat;
				font-weight: 500;
			}
		}
		
		.topNoList{
			padding: 0 24rpx;
			
			.topNoListItem{
				display: inline-block;
				width: 222rpx;
				margin-right: 14rpx;
				border-radius: 8px;
				overflow: hidden;
				position: relative;
				
				.itemLogo{
					position: absolute;
					top: 0;
					left: 0;
					border-radius: 14rpx 0 20rpx;
					background-size: 58rpx 58rpx;
					background-position:0 0 ;
					background-repeat: no-repeat;
					z-index: 1;
					width: 58rpx;
					height: 58rpx;
				}
				
				.itemImage{
					width: 222rpx;
					height: 292rpx;
					
					.image{
						width: 100%;
						height: 100%;
					}
				}
				
				.itemBotUser{
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 90rpx;
					background-image: url("../../static/survey/fanNoBg.png");
					background-repeat: no-repeat;
					background-size: 100% 90rpx;
					
					.userIcon{
						width: 40rpx;
						height: 40rpx;
						margin: 0 auto;
						border-radius: 40rpx;
						display: block;
						margin-top: 4rpx;
					}
					
					.userName{
						text-align: center;
						font-size: 22rpx;
						color: #fff;
						padding-top: 3px;
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
		
		.sortRight{
			display: flex;
			align-items: center;
			
			.endingSort{
				margin-right: 4px;
			}
		}
	}
	
	.forumPost{
		background:#f2f4f5;
		padding:  24rpx;
		min-height: 60vh;
		display: flex;
		
		.forumPostListLeft{
			width: 340rpx;
			margin-right: 22rpx;
		}
		
		.forumPostListRight{
			width: 340rpx;
		}
		
		.forumPostListItem{
			width: 340rpx;
			border-radius: 8px;
			margin-bottom: 12px;
			background: #fff;
			padding-bottom: 16rpx;
			overflow: hidden;
			display: inline-block;
			box-shadow: 0 0 1px 1px #eee;
		}
	}
}
</style>