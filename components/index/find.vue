<template>
	<scroll-view class="itemContent"  @scrolltolower="scrollBottom"
			:refresher-triggered="find.findRefresherTrg"  :scroll-y="find.scrollY" 
			:refresher-enabled="find.findRefresherAble"
			@refresherpulling="scrollPull" :refresher-threshold="100" >
		<view class="content"  :style="{'padding-top': indexChangePadding}" v-if="!pageLoading">
			<view class="card">
				<view class="consultTitle">
					<view class="titleLeft">
						<image src="@/static/list.png" mode="widthFix" class="image"></image>
						<text>官方咨询</text>
					</view>
					<view class="titleRight" @tap.stop="gotoAuthority">
						<text style="padding-right: 6rpx;">全部</text>
						<u-icon name="arrow-right" color="#ddd" size="26"></u-icon>
					</view>
				</view>
				<view class="consultList" v-if="consultData.length">
					<view class="consultItem" v-for="item in consultDataNo3" :key="item.post_id" @tap.stop="navigatePostReplay(item.post_id,item.view_type)">
						<u-tag :text="item.label" size="mini" class="itemTag"></u-tag>
						<text class="itemText">{{item.title}}</text>
						<text class="itemTime">{{item.date|selectDay}}</text>
					</view>
				</view>
			</view>
			
			<view class="consultDiscover" v-if="consultDiscoverData.length">
				<view class="consultDiscoverItem" v-for="(item,index) in consultDiscoverData" :key="item.post.post_id">
					<PostItems :item="item" ></PostItems>
					<view class="message_hotTips" v-if="index === 4">
						<view class="hotTipsTop">
							<text>大家都在聊</text>
							<view class="hotMore">
								<text>更多</text>
								<u-icon name="arrow-right" color="#ddd" size="20"></u-icon>
							</view>
						</view>
						<view class="hotTipsContent" v-if="hotTopics.length > 0">
							<view class="hotTopicsItem" v-for="hot in hotTopics" :key="hot.topic_id">
								<image :src="hot.image|imageUrlReset(100,80)" mode="aspectFill" class="image"></image>
								<view class="topicsDesc">
									<view class="topicsName">
										#{{hot.topic_name}}
									</view>
									<view class="topicsDis">
										{{hot.count.discuss}}人参与讨论
									</view>
								</view>
							</view>
						</view>
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
	import {getFindDiscover} from '../../common/api.js'
	import PostItems from '../common/postItems.vue'
	import {mapState,mapGetters,mapMutations} from "vuex"
	export default {
		name:"index",
		components: {
			PostItems
		},
		props: {
			consultData:{
				type: Array,
				default: () => {
					return []
				}
			},
			hotTopics:{
				type: Array,
				default: () => {
					return []
				}
			}
		},
		computed: {
			...mapState(['tabChangeTop','isFixed','swiperChangeHeight','indexChangePadding',"swiperHeight","tabSwiperScrollTop","tabIndex"]),
		},
		data() {
			return {
				consultDataNo3: this.consultData.splice(0,3),
				consultDiscoverData: [],
				filter: '',
				isLoading: true,
				find: {
					findRefresherTrg: false,
					findRefresherAble: true,
					scrollY: true,
					loadingEnd: false
				},
				timer: null,
				initScroll: 0,
				pageLoading: true
			};
		},
		methods: {
			...mapMutations(['updateScrollProp','swiperChange']),
			async getIndexConsultDiscover(callBack) {
				const res = await getFindDiscover(this.filter)
				if(res) {
					const data = res.data.data
					const list = data.list
					const databox = data.databox
					this.filter = Object.keys(databox)
					this.consultDiscoverData = list
					if(this.pageLoading) {
						this.pageLoading = false
					}
					if(callBack) callBack()
				}
			},
			async upDateDiscover() {
				const res = await getFindDiscover(this.filter)
				const data = res.data.data
				const list = data.list
				const databox = data.databox
				this.filter = Object.keys(databox)
				const newList = list
				this.consultDiscoverData.push(...newList)
			},
			scrollBottom() {
				this.upDateDiscover()
			},
			updateSwiperScrollTop(top) {
				if(this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					this.swiperChange(top)
				}, 500)
			},
			scrollPull(e) {
				//#ifdef MP-WEIXIN
				const deltaY = e.detail.dy
				const load = deltaY > 50
				//#endif
				//#ifndef MP-WEIXIN 
				const deltaY = e.detail.deltaY
				const load = deltaY > 120
				//#endif 
				if(deltaY < 0) {
					return
				}
				if(load) {
					if(this.find.loadingEnd) return
					this.find.loadingEnd = true
					this.find.findRefresherTrg = true
					this.getIndexConsultDiscover(() => {
						this.find.findRefresherTrg = false
						this.find.loadingEnd = false
					})
				}
			},
			navigatePostReplay(post_id,type) {
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
			},
			gotoAuthority() {
				uni.$emit('changeTab',2)
			}
		},
		created() {
			this.getIndexConsultDiscover()
		},
		filters: {
			selectDay(value) {
				const date = new Date()
				const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				const mon = date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth()
				const yea = date.getFullYear()
				
				const nowDate = new Date(`${yea}/${mon}/${day} 00:00:00`)
				const createDate = value*1000
				
				if(nowDate < createDate) {
					return '今天'
				}else{
					 return '昨天'
				}
				return res 
			}
		}
	}
</script>

<style lang="scss" scoped>					
	.itemContent{
		height: 100%;
	}
	.content{
		box-sizing: border-box;
		
		.loading{
			display: flex;
			justify-content: center;
			padding: 40rpx 0;
		}
		
		.card{
			border-radius: 18rpx;
			background: #f8f8f8;
			padding: 24rpx;
			margin: 0 24rpx;
			
			.consultTitle{
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				color: #000;
				padding-bottom: 6rpx;
				
				.titleLeft{
					font-weight: 600;
					display: flex;
					align-items: center;
					
					.image{
						width: 36rpx;
						margin-right: 6rpx;
					}
					
				}
				.titleRight{
					display: flex;
					color: #ddd;
					align-items: center;
					font-weight: 600;
				}
			}
			
			.consultList{
				.consultItem{
					display: flex;
					align-items: center;
					font-size: 28rpx;
					position: relative;
					margin-top: 16rpx;
					
					
					.itemText{
						color: #000;
						width: 550rpx;
						height: 24px;
						line-height: 24px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						padding: 0 12rpx;
						box-sizing: border-box;
					}
					.itemTime{
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						font-size: 24rpx;
						color: #ddd;
					}
				}
			}
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
							
							.image{
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
	}
</style>