<template>
	<view class="latestContent">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		<view class="latestWrapperLine" style="height: 1px;"></view>
		<view class="latestWrapper">
			<view class="latestItems" v-for="(item,index) in newData.list" :key="index" v-if="index < 6">
				<view class="itemsImage">
					<image :src="item.icon|imageUrlReset(100,80)" mode="aspectFill" v-if="loading" class="image"></image>
				</view>
				<view class="itemRight">
					<view class="title">{{item.title}}</view>
					<view class="articleUser">
						<view class="userRight">
							<view class="userImage">
								<image :src="item.avatar_url|imageUrlReset(36,80)" mode="aspectFill" v-if="loading" class="image"></image>
							</view>
							<view class="name">
								{{item.article_user_name}}
							</view>
						</view>
						<view class="userLeft">
							{{item.article_time|getTime}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	export default {
		name:"latestContent",
		components: {
			ModuleTitle
		},
		props: {
			latestData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				moduleTitle: {
					src: '../../static/survey/new.png',
					url: '',
					name: '最新内容'
				},
				newData: this.latestData.children[0],
				loading: false
			};
		},
		filters: {
			getTime(value) {
				if(value > 0)
					{
						const nowYear = new Date().getFullYear()
						const date = new Date(parseInt(value) * 1000)
						const year = date.getFullYear()
						const createDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
						const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth()+1
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
		},
		mounted() {
			this.$nextTick(function() {
				this.intersectionObserver = uni.createIntersectionObserver(this);
				this.intersectionObserver.relativeToViewport({bottom: 0}).observe(`.latestWrapperLine`, (res) => {
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
.latestContent{
	padding: 0 32rpx;
	margin-bottom: 16px;
	
	.latestItems{
		padding: 16px 0;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		
		&:first-of-type{
			padding-top: 0;
		}
		
		&:last-of-type{
			border: 0;
		}
		
		.itemsImage{
			width: 240rpx;
			height: 136rpx;
			border-radius: 4px;
			margin-right: 24rpx;
			overflow: hidden;
			
			.image{
				width: 240rpx;
				height: 136rpx;
			}
		}
		
		.itemRight{
			width: calc(100% - 264rpx);
			
			.title{
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
			
			.articleUser{
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
					
					.userImage{
						width: 40rpx;
						height: 40rpx;
						border-radius: 40rpx;
						margin-right: 4px;
						overflow: hidden;
						
						.image{
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
}
</style>