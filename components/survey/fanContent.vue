<template>
	<view class="fanContent">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		<view class="fanContentLine" style="height: 1px;"></view>
		<view class="tabAndSwiper" v-if="swiperData.length > 0" @touchmove.stop="tochMoveStop">
			<view class="tab">
				<view v-for="(item,index) in swiperData" :key="index" :class="{'active': index === current}"
					@tap.stop="tabClick(index)" class="tabItems" >
					{{item.name}}
				</view>
			</view>
			
			<swiper @change="swiperChange" :current="current"  ref="swiperRefs" :style="{'height': `${swiperHeight}rpx`}">
				<swiper-item v-for="(item, index) in swiperData" :key="index">
					<recommend-video-items :itemData = "item" :loading="loading" v-if="item.name != '原神琴谱'"></recommend-video-items>
					
					<view v-if="item.name === '原神琴谱'" class="musicScore">
						<view v-for="(pop,key) in item.list" :key="key" class="musicScoreItem" v-if="key < 6">
							<image :src="pop.icon|imageUrlReset(30,80)" mode="aspectFill" v-if="loading" class="image"></image>
							<view class="name">
								{{pop.title}}
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	import RecommendVideoItems from "../common/recommendVideoItems.vue"
	export default {
		name:"fanContent",
		components: {
			ModuleTitle,
			RecommendVideoItems
		},
		props: {
			fanData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: 'http://8.138.116.67:5230/miyoushe/survey/fan.png',
					url: '',
					name: '同人内容'
				},
				current: 0,
				swiperData: this.fanData.children,
				swiperHeight: 716,
				musicScoreIndex : 1,
				loading: false
			};
		},
		methods: {
			tabClick(index) {
				this.current = index
				if(index === this.musicScoreIndex) {
					this.swiperHeight = 270
				}else{
					this.swiperHeight = 716
				}
			},
			swiperChange(e) {
				this.current = e.detail.current
				if(e.detail.current === this.musicScoreIndex) {
					this.swiperHeight = 270
				}else{
					this.swiperHeight = 716
				}
			},
			tochMoveStop(event) {
				event.stopPropagation();
			},
		},
		created() {
			for(let i = 0; i< this.swiperData.lenght; i ++) {
				if(this.swiperData[i].name === '原神琴谱') {
					this.musicScoreIndex = i
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.intersectionObserver = uni.createIntersectionObserver(this);
				this.intersectionObserver.relativeToViewport({bottom: 400}).observe(`.fanContentLine`, (res) => {
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
.fanContent{
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
		
		.musicScore{
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			
			.musicScoreItem{
				border-radius: 4px;
				width: 331rpx;
				height: 36px;
				display: flex;
				align-items: center;
				padding: 0 8px;
				box-sizing: border-box;
				margin-bottom: 8px;
				background: #f5f5f5;
				
				.image{
					width: 20px;
					height: 20px;
					border-radius: 4px;
					margin-right: 8px;
				}
				
				.name{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: calc(100% - 44px);
					font-size: 28rpx;
				}
			}
		}
	}
}

</style>