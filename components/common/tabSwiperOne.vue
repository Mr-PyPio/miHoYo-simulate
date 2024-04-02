<template>
	<view class="tabAndSwiper" v-if="swiperData.length > 0">
		<view class="tabAndSwiperLine" style="height: 1px;"></view>
		<view class="tab">
			<view v-for="(item,index) in swiperData" :key="index" :class="{'active': index === current}"
				@tap.stop="tabClick(index)" class="tabItems" >
				{{item.name}}
			</view>
		</view>
		
		<view class="selectTab" v-if="tabList[current]">
			<view v-for="(item,index) in tabList[current]" :key="index">
				<view class="selectTabItems">
					{{index}}
				</view>
			</view>
		</view>
		
		<swiper @change="swiperChange" :current="current"  ref="swiperRefs" style="height: 410rpx;">
			<swiper-item v-for="(item, index) in swiperData" :key="index">
				<recommend-items :itemData = "item" :ref="'recommend'+ index"></recommend-items>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import RecommendItems from '../common/recommendItems.vue'
	export default {
		components: {
			RecommendItems
		},
		data() {
			return {
				current: 0,
			}
		},
		props: {
			swiperData: {
				type: Array,
				default() {
					return []
				}
			},
			swiperOption: {
				type: Object,
				default() {
					return {}
				}
			},
			tabList: {
				type: Array,
				default() {
					return []
				}
			},
		},
		methods: {
			tabClick(index) {
				this.current = index
				this.$refs[`recommend${index}`][0].loading = true
			},
			swiperChange(e) {
				this.current = e.detail.current
				this.$refs[`recommend${e.detail.current}`][0].loading = true
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.intersectionObserver = uni.createIntersectionObserver(this);
				this.intersectionObserver.relativeToViewport({bottom: 0}).observe(`.tabAndSwiperLine`, (res) => {
				  if (res.intersectionRatio > 0) {
					  this.$refs[`recommend0`][0].loading = true
					this.intersectionObserver.disconnect()
				  }
				});
			})
		}
	}
</script>

<style lang="scss" scoped>
.tabAndSwiper{
	.tab{
		display: flex;
		
		.tabItems{
			font-size: 24rpx;
			color: #b59b90;
			padding-bottom: 10px;
			display: inline-block;
			margin-right: 24rpx;
			
			&.active{
				background-image: url("http://8.138.116.67:5230/miyoushe/survey/tab_b.png");
				background-size: 26px 5px;
				background-repeat: no-repeat;
				background-position: center 18px;
			}
		}
	}
	.selectTab{
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		
		.selectTabItems{
			font-size: 22rpx;
			color: #a6a6a6;
			margin-right: 12px;
			height: 24px;
			line-height: 24px;
			padding-right: 16px;
			background-image: url("http://8.138.116.67:5230/miyoushe/survey/down.png");
			background-size: 16px 16px;
			background-position: right 66%;
			background-repeat: no-repeat;
		}
	}
}
</style>