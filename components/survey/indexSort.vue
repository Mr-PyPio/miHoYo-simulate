<template>
	<view class="indexSort">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		
		<view class="tabAndSwiper" v-if="swiperData.length > 0" @touchmove.stop="tochMoveStop">
			<view class="tab">
				<view v-for="(item,index) in swiperData" :key="index" :class="{'active': index === current}"
					@tap.stop="tabClick(index)" class="tabItems" >
					{{item.name}}
				</view>
			</view>
			
			<swiper @change="swiperChange" :current="current"  ref="swiperRefs" :style="{'height': `${swiperHeight}rpx`}">
				<swiper-item v-for="(item, index) in swiperData" :key="index">
					<view class="listItemsWrap">
						<view v-for="(pop,key) in item.list" :key="key" class="listItems" v-if="key < 6">
							<image :src="pop.icon|imageUrlReset(30,80)" mode="aspectFill" class="image"></image>
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
	export default{
		name: 'indexSort',
		components: {
			ModuleTitle,
		},
		props: {
			sortData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: 'http://8.138.116.67:5230/miyoushe/survey/sort.png',
					url: '',
					name: '索引分类'
				},
				swiperHeight: 180,
				swiperData: [],
				current: 0
			}
		},
		methods: {
			tabClick(index) {
				this.current = index
			},
			swiperChange(e) {
				this.current = e.detail.current
			},
			tochMoveStop(event) {
				event.stopPropagation();
			},
		},
		created() {
			this.swiperData = this.sortData.children
		}
	}
</script>

<style lang="scss" scoped>
	.indexSort{
		padding:  0 32rpx;
		margin-top: 16px;
		
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
			
			.listItemsWrap{
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				
				.listItems{
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