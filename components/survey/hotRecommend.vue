<template>
	<view class="hotRecommend">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		<view class="hotRecommendList">
			<view class="hotItems" v-for="(item,index) in hotRecommendData.list" :key="index">
				{{item.title}}
			</view>
		</view>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	export default {
		name:"hotRecommend",
		components: {
			ModuleTitle
		},
		props: {
			hotRecommendData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: '../../static/survey/hot.png',
					url: '',
					name: '热门推荐'
				}
			};
		}
	}
</script>

<style lang="scss" scoped>
.hotRecommend{
	padding: 0 32rpx;
	
	.hotRecommendList{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.hotItems{
			height: 32px;
			line-height: 32px;
			width: 48%;
			box-sizing: border-box;
			padding: 0 6px;
			font-size: 24rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			background: #f8f8f8;
			border-radius: 8px;
			margin-bottom: 8px;
		}
	}
}
</style>