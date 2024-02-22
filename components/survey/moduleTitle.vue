<template>
	<view class="title" v-if="moduleTitle">
		<image :src="moduleTitle.src" mode="aspectFit"></image>
		{{moduleTitle.name}}
		<view class="more">
			更多
		</view>
	</view>
</template>

<script>
	export default {
		name: 'moduleTitle',
		props: {
			moduleTitle: {
				type: Object,
				default() {
					return {}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		font-size: 30rpx;
		font-weight: 600;
		color: #000;
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		position: relative;
		
		image{
			width: 56rpx;
			height: 56rpx;
			margin-right: 4px;
		}
		
		.more{
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			font-size: 22rpx;
			color: #b1968b;
			padding-right: 12px;
			background-image: url("../../static/survey/right_icon.png");
			background-size: auto 8px;
			background-position: right 66%;
			background-repeat: no-repeat;
			font-weight: 500;
		}
	}
</style>