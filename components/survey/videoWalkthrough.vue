<template>
	<view class="videoWalkthrough">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		<view class="videoWalkthroughLine" style="height: 1px;"></view>
		<view class="tabAndSwiper" v-if="swiperData.length > 0">
			<view class="tab">
				<view v-for="(item,index) in swiperData" :key="index" :class="{'active': index === current}"
					@tap.stop="tabClick(index)" class="tabItems" >
					{{item.name}}
				</view>
			</view>
			
			<swiper @change="swiperChange" :current="current"  ref="swiperRefs" style="height: 716rpx;">
				<swiper-item v-for="(item, index) in swiperData" :key="index">
					<recommend-video-items :itemData = "item" :loading="loading"></recommend-video-items>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	import RecommendVideoItems from "../common/recommendVideoItems.vue"
	export default {
		name:"videoWalkthrough",
		components: {
			ModuleTitle,
			RecommendVideoItems
		},
		props: {
			videoData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: 'http://8.138.116.67:5230/miyoushe/survey/video.png',
					url: '',
					name: '视频攻略'
				},
				current: 0,
				swiperData: this.videoData.children,
				loading: false
			};
		},
		methods: {
			tabClick(index) {
				this.current = index
			},
			swiperChange(e) {
				this.current = e.detail.current
			},
		},
		mounted() {
			this.$nextTick(function() {
				this.intersectionObserver = uni.createIntersectionObserver(this);
				this.intersectionObserver.relativeToViewport({bottom: 400}).observe(`.videoWalkthroughLine`, (res) => {
				  if (res.intersectionRatio > 0) {
					this.loading = true
					this.intersectionObserver.disconnect()
				  }
				});
			})
		}
	}
</script>

<style lang="scss" scoped>
.videoWalkthrough{
	padding: 0 32rpx;
	
	.tabAndSwiper{
		.tab{
			display: flex;
			margin-bottom: 10px;
			
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
	}
}

</style>