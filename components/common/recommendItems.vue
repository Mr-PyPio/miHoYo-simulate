<template>
	<view class="recommentCotent" >
		<view class="recommentItems" v-for="(pop,index) in itemData.list"  :key="index" v-if="index < 4">
			<view class="itemsTitle">
				{{pop.title}}
			</view>
			<view class="cardLine"></view>
			<view class="itemImage">
				<view class="itemIcon">
					<image :src="pop.icon|imageUrlReset(50,80)" mode="aspectFill" v-if="loading"></image>
				</view>
				<view class="line"></view>
				<view class="itemRecImage">
					<view class="itemRecImageWrapp"  v-if="loading">
						<image v-for="(item,index) in pop.ext.list" :key="index" 
							:src="item|imageUrlReset(36,80)" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"recommendItems",
		props: {
			itemData: {
				type: Object,
				default() {
					return {}
				}
			},
			loadingKey: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		data() {
			return {
				loading: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recommentCotent{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.recommentItems{
			width: 336rpx;
			height: 184rpx;
			padding: 20rpx 16rpx 24rpx;
			box-sizing: border-box;
			background-image: url("../../static/survey/itemsBg.png");
			background-repeat: no-repeat;
			background-size: 336rpx 184rpx;
			margin-bottom: 20rpx;
			
			.itemsTitle{
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #3B4354;
				font-size: 28rpx;
			}
			
			.cardLine{
				background-image: url("../../static/survey/line.png");
				background-size: 100% 12rpx;
				background-repeat: no-repeat;
				margin: 4rpx 0 8rpx;
				width: 100%;
				height: 12rpx;
			}
			
			.itemImage{
				display: flex;
				align-items: center;
				
				.itemIcon{
					width: 68rpx;
					height: 68rpx;
					position: relative;
					border-radius: 6rpx;
					
					image{
						width: 68rpx;
						height: 68rpx;
					}
					
					&::after{
						content: '';
						display: block;
						width: 68rpx;
						height: 68rpx;
						background-image: url("../../static/survey/imgBox.png");
						background-size: 68rpx 68rpx;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
				
				.line{
					height: 68rpx;
					margin: 0 8rpx;
					width: 1px;
					background: rgba(177,150,139,0.2);
				}
				
				.itemRecImage{
					padding-left: 54rpx;
					box-sizing: border-box;
					width: 206rpx;
					height: 68rpx;
					background-image: url("../../static/survey/itemRecImage.png");
					background-size: 206rpx 68rpx;
					background-repeat: no-repeat;
					
					.itemRecImageWrapp{
						display: flex;
						align-items: center;
						height: 100%;
					}
					
					image{
						width: 44rpx;
						height: 44rpx;
						border-radius: 44rpx;
						margin-right: 10rpx;
						
						&:last-of-type{
							margin: 0;
						}
					}
				}
				
			}
		}
	}

</style>