<template>
	<scroll-view class="itemContent" @scrolltolower="scrollBottom"
			:refresher-triggered="scrollMessage.refresherTrg"  :scroll-y="scrollMessage.scrollY"
			:refresher-enabled="scrollMessage.refresherAble"
			@refresherpulling="scrollPull" :refresher-threshold="100" >
			<view class="content">
				<view class="topNew" v-if="topNewData">
					<view v-for="(item,index) in topNewData" :key="index" class="newItems"  @tap.stop="navigatePostReplay(item.post_id,item.view_type)">
						<view class="newImage">
							<image :src="item.image_url|imageUrlReset(300,80)" mode="widthFix" class="imageDetail"></image>
							<view class="newTime">
								{{item.date|changeMonAndDay}}
							</view>
						</view>
						<view class="newTitle">
							{{item.title}}
						</view>
					</view>
				</view>
				
				<view class="postListContent"  v-if="postList">
					<view class="postListTab">
						<view v-for="(item,index) in tabList"  :key="index" class="tabItems"
							:class="{'active' : item.type === tabType}" @tap.stop="tabClick(item.type)">
							{{item.title}}
						</view>
					</view>
					
					<view class="postList">
						<template v-if="tabType1 != 2">
							<view class="postListItems" v-for="(item,index) of postList" :key="item.post.post_id"  @tap.stop="navigatePostReplay(item.post.post_id,item.post.view_type)">
								<view class="itemsLeftDesc">
									<view class="subject">
										{{item.post.subject}}
									</view>
									<view class="time">
										{{item.post.created_at|changeMonAndDay}}
									</view>
								</view>
								<view class="itemsRightImage">
									<image :src="item.image_list[0].url|imageUrlReset(500,80)" mode="widthFix" class="image"></image>
								</view>
							</view>
						</template>
						<template v-if="tabType1 === 2">
							<view class="postListItems2" v-for="(item,index) of postList" :key="item.post.post_id"  @tap.stop="navigatePostReplay(item.post.post_id,item.post.view_type)">
								<view class="itemsRightImage2">
									<image :src="item.image_list[0].url|imageUrlReset(500,80)" mode="widthFix" class="image"></image>
								</view>
								<view class="itemsLeftDesc2">
									<view class="subject">
										{{item.post.subject}}
									</view>
									<view class="time">
										<image :src="`${imageBaseUrl}activity${item.news_meta.activity_status}.png`" mode="heightFix" class="activityImage"></image>
										<view class="limit">
											<u-icon name="clock" color="#7f858a" size="24" style="margin-right: 6rpx;"></u-icon>
											{{item.news_meta.start_at_sec|resetDateTime}} ~ {{item.news_meta.end_at_sec|resetDateTime}}
										</view>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
				<view class="loading">
					<u-loading-icon mode="circle" size="42"></u-loading-icon>
				</view>
			</view>
	</scroll-view>
</template>

<script>
	import {mapState} from 'vuex'
	import {getNewsList,getHomeNew} from '../../common/api.js'
	export default {
		data() {
			return {
				scrollMessage: {
					refresherTrg: false,
					refresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				topNewData: null,
				postList: null,
				last_id: 0,
				is_last: false,
				tabList: [
					{
						title: '官方资讯',
						type: 3
					},
					{
						title: '活动',
						type: 2
					},
					{
						title: '公告',
						type: 1
					}
				],
				tabType: 3,
				tabType1: 3,
				loading: true
			}
		},
		computed: {
			...mapState(['imageBaseUrl'])
		},
		methods: {
			async getTopNew () {
				const {data : res} = await getHomeNew('4')
				const newData = res.data.official.data
				this.topNewData = newData ? newData.slice(0,2) : null
			},
			async getListData(type,callback) {
				this.loading = true
				const {data : res} = await getNewsList(type)
				this.postList = res.data.list
				this.last_id = res.data.last_id
				this.is_last = res.data.is_last
				this.loading = false
				if(callback) {
					callback()
				}
			},
			async upListData() {
				if(!this.is_last && !this.loading) {
					const {data : res} = await getNewsList(this.tabType,this.last_id)
					this.postList.push(...res.data.list)
					this.last_id = res.data.last_id
					this.is_last = res.data.is_last
				}
			},
			tabClick(type) {
				this.tabType = type
				this.getListData(type,() => {
					this.tabType1 = type
				})
			},
			scrollBottom() {
				this.upListData()
			},
			scrollPull(e) {
				if(e.detail.deltaY < 0) {
					return
				}
				if(e.detail.deltaY > 120) {
					if(this.scrollMessage.loadingEnd) return
					this.scrollMessage.loadingEnd = true
					this.scrollMessage.refresherTrg = true
					this.getListData(() => {
						this.scrollMessage.refresherTrg = false
						this.scrollMessage.loadingEnd = false
					})
				}
			},
			navigatePostReplay(post_id,type) {
				console.log(post_id,type)
				if(type === 5) {
					// uni.navigateTo({
					// 	url: `/subPackages/postReplay/postReplay?post_id=${post_id}`,
					// })
					uni.$emit('navPage','postReplay',post_id)
				}else if(type === 1){
					// uni.navigateTo({
					// 	url: `/subPackages/artical/artical?post_id=${post_id}`,
					// })
					uni.$emit('navPage','artical',post_id)
				}
			}
		},
		created() {
			this.getTopNew()
			this.getListData(this.tabType)
		},
		filters: {
			changeMonAndDay(value) {
				const nowDate = new Date()
				const date = new Date(parseInt(value) * 1000)
				const nowDay = nowDate.getDate()
				const day = date.getDate()
				if(nowDay === day) {
					const nowHours = nowDate.getHours()
					const hours = date.getHours()
					return `${nowHours - hours}小时前`
				}
				const createDay = day < 10 ? `0${day}` : day
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${createMon}-${createDay}`
			},
			resetDateTime(value) {
				const date = new Date(parseInt(value) * 1000)
				const day = date.getDate() < 10 ? `0${ date.getDate()}` :  date.getDate()
				const mon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				const year = date.getFullYear()  < 10 ? `0${date.getFullYear()}` : date.getFullYear()
				
				return `${year}/${mon}/${day}`
			}
		},
	}
</script>

<style lang="scss" scoped>
	.itemContent{
		height: 100%;
	}
	.content{
		padding: 0 24rpx;
		
		.loading{
			display: flex;
			justify-content: center;
			padding: 40rpx 0;
		}
		
		.topNew{
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			
			.newItems{
				width: 340rpx;
				.newImage{
					position: relative;
					height: 192rpx;
					border-radius: 8px;
					overflow: hidden;	
					
					.imageDetail{
						width: 340rpx;
						height: 192rpx;
					}
					
					.newTime{
						font-size: 22rpx;
						color: #fff;
						position: absolute;
						bottom: 4px;
						right: 8px;
					}
				}

				.newTitle{
					padding-top: 12rpx;
					font-size: 24rpx;
					color: #000;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
					-webkit-line-clamp: 2;
				}
			}
		}
	
		.postListTab{
			display: flex;
			
			.tabItems{
				color: #999;
				background: #f5f5f5;
				border-radius: 4px;
				padding: 3px 8px;
				margin-right: 12rpx;
				font-size: 22rpx;
				
				&.active{
					background:#d7fefe;
					color: #71e0fe;
				}
			}
		}
		
		.postList{
			.postListItems{
				padding:  20rpx 0;
				display: flex;
				border-bottom: 1px solid #f8f8f8;
				
				.itemsLeftDesc{
					width: 392rpx;
					position: relative;
					
					.subject{
						display: -webkit-box;
						-webkit-box-orient: vertical;
						overflow: hidden;
						-webkit-line-clamp: 2;
						color: #000;
						font-size: 26rpx;
						font-weight: 600;
						line-height: 1.6em;
					}
					
					.time{
						font-size: 22rpx;
						color: #ddd;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
				
				.itemsRightImage{
					margin-left: 30rpx;
					width: 280rpx;
					height: 120rpx;
					display: flex;
					align-items: center;
					overflow: hidden;
					border-radius: 4px;
					
					.image{
						width: 280rpx;
					}
				}
			}
			
			.postListItems2{
				margin: 0 -24rpx;
				padding: 24rpx;
				border-bottom: 4px solid #f8f8f8;
				
				.itemsRightImage2{
					width: 702rpx;
					height: 320rpx;
					border-radius: 8px;
					overflow: hidden;
					
					.image{
						width: 702rpx;
					}
				}
				
				.itemsLeftDesc2{
					width: 100%;
					padding-top: 12rpx;
					
					.subject{
						display: -webkit-box;
						-webkit-box-orient: vertical;
						overflow: hidden;
						-webkit-line-clamp: 2;
						color: #000;
						font-size: 26rpx;
						font-weight: 600;
						line-height: 1.6em;
					}
					
					.time{
						margin-top: 12rpx;
						width: 100%;
						height: 48rpx;
						background: #f9f9f9;
						border-radius: 8rpx;
						overflow: hidden;
						text-align: right;
						padding-right: 16rpx;
						position: relative;
						box-sizing: border-box;
						
						.activityImage{
							height: 48rpx;
							left: 0;
							top: 0;
							position: absolute;
						}
						
						.limit{
							display: flex;
							justify-content: flex-end;
							font-size: 20rpx;
							color: #7f858a;
							line-height: 48rpx;
						}
					}
				}
			}
		}
	}
</style>