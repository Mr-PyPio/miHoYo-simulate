<template>
		<u-popup :show="show" mode="right" @close="close" @open="open">
			<view class="userPopup">
				<view class="popupContent">
					<view class="listItems">
						<image src="../../static/user/popPalyer.png" mode="widthFix" class="itemsIcon"></image>
						游戏角色
					</view>
					<view class="listItems">
						<image src="../../static/user/popFavo.png" mode="widthFix" class="itemsIcon"></image>
						我的收藏
					</view>
					<view class="listItems">
						<image src="../../static/user/pophis.png" mode="widthFix" class="itemsIcon"></image>
						浏览历史
					</view>
				</view>
				<view class="popupContent">
					<view class="listItems">
						<image src="../../static/user/popWrite.png" mode="widthFix" class="itemsIcon"></image>
						创作中心
					</view>
					<view class="listItems">
						<image src="../../static/user/popGame.png" mode="widthFix" class="itemsIcon"></image>
						游戏中心
					</view>
					<view class="listItems">
						<image src="../../static/user/popCommunity.png" mode="widthFix" class="itemsIcon"></image>
						社区中心
					</view>
					<view class="listItems">
						<image src="../../static/user/popPrize.png" mode="widthFix" class="itemsIcon"></image>
						我的奖品
					</view>
				</view>
				<view class="popupContent">
					<view class="listItems">
						<image src="../../static/user/popMib.png" mode="widthFix" class="itemsIcon"></image>
						米游币
						<view class="residue">
							余额：490
						</view>
					</view>
					<view class="listItems">
						<image src="../../static/user/popConvert.png" mode="widthFix" class="itemsIcon"></image>
						兑换中心
					</view>
					<view class="listItems">
						<image src="../../static/user/popShop.png" mode="widthFix" class="itemsIcon"></image>
						米游铺
					</view>
					<view class="listItems">
						<image src="../../static/user/popStall.png" mode="widthFix" class="itemsIcon"></image>
						创小摊
					</view>
				</view>
				
				<view class="popupBottom">
					<view class="set popupBottomItem">
						<image src="../../static/user/meun_set.png" mode="widthFix" class="icon"></image>
						<view class="">设置</view>
					</view>
					<view class="mode popupBottomItem">
						<image src="../../static/user/meun_mode.png" mode="widthFix" class="icon"></image>
						<view class="">青少年模式</view>
					</view>
					<view class="set popupBottomItem">
						<image src="../../static/user/meun_service.png" mode="widthFix" class="icon"></image>
						<view class="">联系客服</view>
					</view>
				</view>
			</view>
		</u-popup>
</template>

<script>
	
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {
			open() {
				
			},
			close() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userPopup{
		width: 500rpx;
		background: #f5f5f5;
		padding-top: 60px;
		height: 100%;
		position: relative;
		
		.popupBottom{
			position: absolute;
			bottom: 0;
			width: 500rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			padding: 30rpx 0 80rpx;
			background: #fff;
			
			.popupBottomItem{
				text-align: center;
				padding: 0 26rpx;
				font-size: 24rpx;
				color: #ccc;
				
				.icon{
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 12rpx;
				}
			}
		}
	}
	.popupContent{
		background: #fff;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		margin: 20rpx;
		margin-right: 0;
		padding-left: 30rpx;
		
		.listItems{
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			font-size: 28rpx;
			color: #000;
			position: relative;
			
			.itemsIcon{
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}
			
			.residue{
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				font-size: 24rpx;
				color: #ccc;
			}
		}
	}
</style>