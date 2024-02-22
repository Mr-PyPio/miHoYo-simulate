<template>
	<view class="top_posts">
		<view class="posts_item" v-for="(item,index) in topPosts" :key="item.post_id" v-if="index < 4">
			<u-tag :text="item.post_status|getStatus" size="mini" class="itemTag"></u-tag>
			<text class="itemText">{{item.subject}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			topPosts: {
				type: Array,
				default() {
					return []
				}
			}
		},
		filters: {
			getStatus(value) {
				if(value.is_top) {
					return '置顶'
				}else if(value.is_good) {
					return 'Good'
				}else if(value.is_official) {
					return 'Offic'
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top_posts{
		padding: 24rpx 0;
		margin: 0 auto;
		width: calc(100% - 48rpx);
		border-top: 1px solid #f8f8f8;
		padding-bottom: 0;
		
		.posts_item{
			display: flex;
			align-items: center;
			padding-bottom: 10px;
			
			.itemTag{
				display: inline-block;
				margin-right: 16rpx;
			}
			
			.itemText{
				font-size: 28rpx;
				color: #000;
				font-weight: 500;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
	
			}
		}
	}
</style>