<template>
	<view class="gameplay">
		<view class="moduleTitle">
			<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		</view>
		<view class="gameSwiper" style="width: 100%;">
			<scroll-view style="white-space: nowrap;overflow-x: auto;width: 750rpx;height: 252rpx;" scroll-x="true">
				<view class="gameSwiperItemsWrap" v-for="(item,index) in gameplayExplorationShowData" :key="index">
					<view class="gameSwiperItems">
						<view class="itemLeft">
							<!-- <image :src="item.ch_ext.value|imageUrlReset(150,80)" mode="aspectFit"></image> -->
							<lazy-image :src="item.ch_ext.value|imageUrlReset(150,80)" mode="widthFix"
								:srcStyle="{'width': '216rpx','height': '216rpx'}"
							></lazy-image>
						</view>
						<view class="itemRight">
							<view class="itemTitle">{{item.name}}</view>
							<view class="playList">
								<view class="playListItems" v-for="(play,playIndex) in item.children" :key="playIndex" v-if="playIndex < 3 ">
									<text>{{play.name}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	import LazyImage from '../common/lazyImage.vue'
	export default {
		name:"gamePlay",
		components: {
			ModuleTitle,
			LazyImage
		},
		props: {
			gameplayExplorationShowData: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: '../../static/survey/game.png',
					url: '',
					name: '玩法探索'
				}
			};
		}
	}
</script>

<style lang="scss" scoped>
.gameplay{
	padding: 10px 0;
	
	.title{
		margin: 0 32rpx;
	}
	
	.moduleTitle{
		padding: 0 32rpx;
	}
	
	.gameSwiperItemsWrap{
		display: inline-block;
		margin-right: 10px;
		
		&:first-of-type{
			margin-left: 32rpx;
		}
		
		&:last-of-type{
			margin: 0;
			margin-right: 32rpx;
		}
	}
	
	.gameSwiperItems{
		background: #f5f5f5;
		border-radius: 8px;
		padding: 8px;
		box-sizing: border-box;
		display: flex;
		flex: 1;
		
		.itemLeft{
			width: 216rpx;
			height: 216rpx;
			margin-right: 8px;
			border-radius: 8px;
			position: relative;
			overflow: hidden;
			
			image{
				width: 100%;
				height: 100%;
			}
			
			&::after{
				content: '更多';
				display: block;
				position: absolute;
				bottom: 0;
				right: 0;
				font-size: 20rpx;
				color: #fff;
				padding: 2px 6px;
				background: rgba(0, 0, 0, .5);
				border-top-left-radius: 8px;
			}
		}
		
		.itemRight{
			width: 230rpx;
			
			.itemTitle{
				color: #986c5a;
				text-align: center;
				font-size: 26rpx;
				background: #ebe5d6;
				height: 24px;
				line-height: 24px;
				border-radius: 12px;
				padding: 0 8px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				&::before{
					content: '';
					display: block;
					width: 12px;
					height: 12px;
					background-image: url("../../static/survey/miniIcon.png");
					background-repeat: no-repeat;
					background-size: 12px 12px;
				}
				
				&::after{
					content: '';
					display: block;
					width: 12px;
					height: 12px;
					background-image: url("../../static/survey/miniIcon.png");
					background-repeat: no-repeat;
					background-size: 12px 12px;
				}
			}
			
			.playList{
				padding-top:28rpx;
				
				.playListItems{
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #43526e;
					margin-bottom: 8px;
					padding-left: 15px;
					box-sizing: border-box;
					position: relative;
					
					text{
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					&::before{
						content: '';
						display: block;
						width: 12px;
						height: 12px;
						background-image: url("../../static/survey/miniIcon2.png");
						background-repeat: no-repeat;
						background-size: 12px 12px;
						position: absolute;
						left: 0;
					}
				}
			}
		}
	}
}
</style>