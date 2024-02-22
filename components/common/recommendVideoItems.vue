<template>
	<view>
		<view  class="videoContent" :class="'videoContent'+itemData.id">
			<view class="videoItems" v-for="(pop,index) in itemData.list"  :key="pop.content_id" v-if="index < 4">
				<view class="itemsImage">
					<image :src="pop.icon|imageUrlReset(120,80)" mode="aspectFill" v-if="loading"></image>
				</view>
				<view class="itemsTitle">
					{{pop.title}}
				</view>
				<view class="videoUser">
					<view class="userRight">
						<view class="userImg">
							<image :src="pop.avatar_url|imageUrlReset(30,80)" mode="aspectFill" v-if="pop.avatar_url && loading"></image>
						</view>
						<view class="name" v-if="pop.article_user_name">
							{{pop.article_user_name}}
						</view>
					</view>
					<view class="userLeft" v-if="pop.article_time">
						{{pop.article_time|getTime}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			itemData: {
				type: Object,
				default() {
					return {}
				}
			},
			loading: {
				type: Boolean,
				default() {
					return false
				}
			}
		},
		filters: {
			getTime(value) {
				if(value > 0)
					{
						const nowYear = new Date().getFullYear()
						const date = new Date(parseInt(value) * 1000)
						const year = date.getFullYear()
						const createDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
						const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
						const H = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
						const M = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
						if(year === nowYear) {
							return `${createMon}-${createDay} ${H}:${M}`
						}else{
							return `${year}-${createMon}-${createDay}`
						}
					}
				else{
					return ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.videoContent{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	
	.videoItems{
		width: 331rpx;
		margin-bottom: 15px;
		
		.itemsImage{
			width: 100%;
			height: 184rpx;
			border-radius: 6px;
			overflow: hidden;
			
			image{
				width: 100%;
				height: 184rpx;
			}
		}
		
		.itemsTitle{
			height: 40px;
			line-height: 20px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; 
			margin-top: 4px;
			font-size: 28rpx;
		}
		
		.videoUser{
			display: flex;
			justify-content: space-between;
			height: 40rpx;
			margin-top: 4px;
			align-items: center;
			font-size: 24rpx;
			color: #a6a6a6;
			
			.userRight{
				display: flex;
				align-items: center;
				
				.userImg{
					width: 40rpx;
					height: 40rpx;
					border-radius: 40rpx;
					margin-right: 4px;
					overflow: hidden;
					
					image{
						width: 40rpx;
						height: 40rpx;
					}
				}
				
				.name{
					width: 135rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}
		}
	}
}
</style>