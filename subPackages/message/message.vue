<template>
	<view>
		<!-- #ifdef WEB -->
		<view class="topTab">
			消息
		</view>
		<!-- #endif -->
		
		<scroll-view scroll-y="true" :style="{'height': windowHeight*rpxNum - 80 + 'rpx'}">
			<view class="content">
				<view class="tipcs">
					<view class="tipcsItems">
						<image src="../../static/message/replay.png" mode="widthFix" class="icon"></image>
						<view class="">
							回复我的
						</view>
					</view>
					<view class="tipcsItems">
						<image src="../../static/message/callMe.png" mode="widthFix" class="icon"></image>
						<view class="">
							@我的
						</view>
					</view>
					<view class="tipcsItems">
						<image src="../../static/message/zan.png" mode="widthFix" class="icon"></image>
						<view class="">
							收到的赞
						</view>
					</view>
					<view class="tipcsItems">
						<image src="../../static/message/subscribe.png" mode="widthFix" class="icon"></image>
						<view class="">
							订阅通知
						</view>
					</view>
				</view>
				
				<view class="reviewEnd" v-if="lzReviewReply">
					<image src="../../static/poseRequlay/noreply.png" mode="widthFix" class="image"></image>
					<view class="text">
						暂时还没有收到私信消息哦
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				lzReviewReply: true,
			};
		},
		computed: {
			...mapState(['windowHeight','rpxNum'])
		},
		onLoad() {
		}
	}
</script>

<style lang="scss" scoped>
	.topTab{
		height: 80rpx;
		width: 100%;
		font-size: 36rpx;
		color: #000;
		text-align: center;
		line-height: 80rpx;
	}
	
	.content{
		overflow: hidden;
		
		.tipcs{
			display: flex;
			align-items: center;
			justify-content: space-around;
			
			.icon{
				width: 80rpx;
				margin-top: 40rpx;
			}
			
			.tipcsItems{
				text-align: center;
				font-size: 24rpx;
				color: #b8bec1;
			}
		}
	}
	
	.reviewEnd{
		padding: 15px 0 30px;
		margin-top: 20vh;
		
		.image{
			width: 450rpx;
			margin: 0 auto;
			display: block;
		}
		
		.text{
			font-size: 32rpx;
			color: #b8bec1;
			text-align: center;
		}
	}
</style>
