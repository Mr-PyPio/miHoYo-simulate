<template>
	<view class="mapIcon">
		<view class="mapIconItems" v-for="(item,index) in mapShowData" :key="index" v-if="index < 7">
			<image :src="item.ch_ext.value|imageUrlReset(60,80)" mode="aspectFit"></image>
			<text>{{item.name}}</text>
		</view>
		<view class="mapIconItems">
			<image src="../../static/survey/moreMap.png" mode="aspectFit"></image>
			<text>更多</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"surveyCatalogicon",
		props: {
			mapShowData: {
				type: Array,
				default() {
					return []
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
.mapIcon{
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	padding: 32rpx 32rpx 20rpx;
	
	.mapIconItems{
		box-sizing: border-box;
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		padding-bottom: 15px;
		
		image{
			width: 90rpx;
			height: 90rpx;
			margin-bottom: 5px;
		}
		
		text{
			display: block;
			text-align: center;
			width: 100%;
			font-size: 24rpx;
		}
	}
}

</style>