<template>
	<view class="content">
		<page-tab></page-tab>
		
		<view class="fixedTop">
			<view class="follow fixedTopTab" :class="{'active': clickTab === 0}" @tap.stop="fixedTop(0)">
				<view class="followText">
					{{followText}}
				</view>
				<template v-if="clickTab === 0">
					<u-icon :name="followName" color="#000" size="16" ></u-icon>
				</template>
			</view>
			<view class="find fixedTopTab" :class="{'active': clickTab === 1}" @tap.stop="fixedTop(1)">
				发现
			</view>
			<view class="dynamic" v-if="isDynamic">
				发动态
			</view>
		</view>
		
		<view class="popupWrap"  :style="{'height' : this.windowHeight*this.rpxNum - 72 + 'rpx', 'top' : popupWrapTop}" @tap.stop="hidden">
			
		</view>
		<view class="popupContent" v-if="timelineCategoryData" :style="{'top' : popupTop}">
			<view v-for="(item,index) in timelineCategoryData" :key="item.id" 
				@tap.stop="categoryChange(item.id,item.label)" class="popupContentItem">
				{{item.label}}
			</view>
		</view>
		
		<swiper :style="{'height' : swiperHeight}" :current="swiperIndex" @change="swiperChange">
			<swiper-item>
				<follow-content ref="folloeRefs"></follow-content>
			</swiper-item>
			<swiper-item>
				<find-content ref="findRefs"></find-content>
			</swiper-item>
		</swiper>
		<img-pop-up ></img-pop-up>
	</view>
</template>

<script>
	import {mapMutations,mapState} from "vuex"
	import PageTab from '../../components/common/pageTab.vue'
	import FollowContent from '@/components/action/followContent.vue'
	import FindContent from '@/components/action/findContent.vue'
	import {getTimelineCategory} from '@/common/api.js'
	import ImgPopUp from '@/components/common/imgPopUp.vue'
	export default {
		components: {
			PageTab,
			FindContent,
			FollowContent,
			ImgPopUp
		},
		data() {
			return {
				followName: 'arrow-down-fill',
				clickTab: 0,
				swiperIndex: 0,
				timelineCategoryData: null,
				popupTop: '-100%',
				popupWrapTop: '-100%',
				followText: '关注'
			};
		},
		computed: {
			...mapState(['actionPage']),
			swiperHeight() {
				return this.windowHeight*this.rpxNum - 172 + 'rpx'
			},
			isDynamic() {
				if(this.clickTab == 0) {
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			...mapMutations(['updateActionPage']),
			async getPostData() {
				const {data: res} = await getTimelineCategory()
				console.log(res)
				if(res.data) {
					this.timelineCategoryData = res.data.list
					this.updateActionPage({
						name: 'category',
						data: res.data.list
					})
				}
			},
			fixedTop(type) {
				if(type === 0) {
					if(this.clickTab === 0) {
						if(this.popupWrapTop === '72rpx') {
							this.hidden()
						}else{
							this.popupWrapTop = '72rpx'
							this.popupTop = '72rpx'
						}
					}
				}else{
					this.hidden()
				}
				this.clickTab = type
				this.swiperIndex = type
			},
			categoryChange(cateId,name) {
				this.$nextTick(() => {
					this.followText = name
					const Refs = this.$refs.folloeRefs
					const oldId = Refs.categroyId
					if(cateId === 0) {
						this.followText = '关注'
					}
					if(oldId != cateId) {
						Refs.categroyId = cateId
						Refs.getPostData(cateId)
					}
					this.hidden()
				})
			},
			hidden() {
				this.popupTop = '-100%'
				this.popupWrapTop = '-100%'
			},
			swiperChange(e) {
				this.clickTab = e.detail.current
				this.swiperIndex = e.detail.current
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight
				}
			})
			if(this.actionPage.category) {
				this.timelineCategoryData = this.actionPage.category
			}else{
				this.getPostData()
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	padding-bottom: 100rpx;
	
	.fixedTop{
		position: relative;
		top: 0;
		left: 0;
		width: 750rpx;
		background: #f8f8f8;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		
		.fixedTopTab{
			font-size: 30rpx;
			color: #c0c5c8;
			position: relative;
			padding: 16rpx 0;
			margin: 0 16rpx;
			
			.followText{
				padding-right: 10rpx;
			}
			
			&.active{
				color: #000;
				
				&::after{
					content: '';
					display: block;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					height: 8rpx;
					width: 30rpx;
					border-radius: 8rpx;
					background: #19a3ff;
				}
			}
		}
		
		.follow{
			display: flex;
			align-items: center;
		}
		
		.dynamic{
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 24rpx;
			font-size: 22rpx;
			color: #333;
		}
	}
	
	.popupWrap{
		position: fixed;
		left: 0;
		width: 750rpx;
		z-index: 1;
		background: rgba(0, 0, 0, 0.4);
	}
	.popupContent{
		position: fixed;
		left: 0;
		width: 750rpx;
		padding: 18rpx 24rpx;
		padding-bottom: 0;
		background: #fff;
		box-sizing: border-box;
		transition-duration: 300ms;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		z-index: 2;
		
		.popupContentItem{
			width: 32%;
			padding: 8rpx 0;
			background: #eff1f4;
			border-radius: 8rpx;
			color: #7f858a;
			font-size: 20rpx;
			text-align: center;
			margin-bottom: 18rpx;
		}
	}
}
</style>
