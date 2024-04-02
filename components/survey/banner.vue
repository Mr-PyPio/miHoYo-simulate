<template>
	<view class="content">
		<swiper :autoplay="true" previous-margin="24rpx" @change="swiperChange" :current="current"
		next-margin="24rpx" :circular="true" style="height:172rpx">
			<swiper-item v-for="(item,index) in topBanner" :key="index">
				<view class="swiper-item">
					<LazyImageTwo :src="item.image|imageUrlReset(200,80)" mode="widthFix" :index="item.id"></LazyImageTwo>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="indicator">
			<view
					class="indicator__dot"
					v-for="(item, index) in topBanner"
					:key="index"
					:class="[index === current && 'indicator__dot--active']"
					@tap="indicatorClick(index)"
			>
			</view>
		</view>
	</view>
</template>

<script>
	import LazyImageTwo from '../common/lazyImageTwo.vue'
	export default {
		name:"banner",
		components: {
			LazyImageTwo
		},
		props: {
			topBanner: {
				tyep: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				current: 0
			};
		},
		methods: {
			swiperChange(e) {
				this.current = e.detail.current
			},
			indicatorClick(index) {
				this.current = index
			}
		},
	}
</script>

<style lang="scss" scoped>
.content{
	position: relative;
}
.indicator {
	position: absolute;
	display: flex;
	justify-content: flex-end;
	bottom: 8rpx;
	right: 50rpx;

	&__dot {
		 height: 2px;
		 width: 6px;
		 background-color: rgba(255, 255, 255, 0.35);
		 margin: 0 2px;
		 transition: background-color 0.3s;
		 border-radius: 2px;

		&--active {
			 background-color: #ffffff;
			 width: 12px; 
		 }
	}
}
.swiper-item{
	margin:0 10rpx;
	height:172rpx;
	overflow: hidden;
	width: 682rpx;
	box-sizing: border-box;
	border-radius: 18rpx;
}
</style>