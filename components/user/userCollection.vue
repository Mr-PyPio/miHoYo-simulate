<template>
	<scroll-view scroll-y="true" style="100%" :scrolltolower = "scrolltolower" >
		<view class="contentList">
			<view class="createBtn">
				<u-icon name="plus" color="#000" size="20"></u-icon>
				创建合集
			</view>
			
			<view class="list">
				<view class="listItem" v-for="(item,index) in postData" :key="item.id">
					<image :src="item.cover|imageUrlReset(100,80)" mode="aspectFill" class="itemLogo"></image>
					<view class="itemContent">
						<view class="title">{{item.title}}</view>
						<view class="desc">{{item.desc}}</view>
						<view class="message">
							{{item.post_num}}篇作品 · {{item.view_num}}浏览 · {{item.post_updated_at|changeMonAndDay}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="reviewEnd" v-if="allShow">
			<image :src="imageBaseUrl + 'poseRequlay/reviewEnd.png'" mode="widthFix" class="logo"></image>
		</view>
		<view class="noLimit" v-if="!limit">
			<image :src="imageBaseUrl + 'user/noLimit.png'" mode="widthFix" class="logo"></image>
		</view>
	</scroll-view>
</template>

<script>
	import {getUserCollection} from "../../common/api.js"
	import {mapState} from 'vuex'
	export default {
		props: {
			uid: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				postData: null,
				is_last: false,
				loading: false,
				limit: true,
			}
		},
		computed: {
			...mapState(['imageBaseUrl']),
			allShow() {
				return this.is_last
			},
		},
		methods: {
			async getDate() {
				const {data: res} = await getUserCollection(this.uid)
				if(res.message === "权限不足") {
					this.limit = false
				}
				if(res.data) {
					this.postData = res.data.list
					this.is_last = res.data.is_last
				}
			},
			scrolltolower() {}
		},
		created() {
			this.getDate()
		},
		filters: {
			changeMonAndDay(value) {
				const nowDate = new Date()
				const date = new Date(parseInt(value) * 1000)
				const nowDay = nowDate.getDate()
				const day = date.getDate()
				if(nowDay === day) {
					const nowHours = nowDate.getHours()
					const nowMinutes= nowDate.getMinutes()
					const hours = date.getHours()
					const minutes = date.getMinutes()
					if(nowHours == hours) {
						return `${nowMinutes - minutes}分钟前`
					}else{
						return `${nowHours - hours}小时前`
					}
				}
				const createDay = day < 10 ? `0${day}` : day
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				const nowYear = nowDate.getFullYear()
				const year = date.getFullYear()
				if(nowYear === year) {
					return `${date.getMonth() + 1}-${day}`
				}else{
					return `${date.getFullYear()}-${date.getMonth() + 1}-${day}`
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.contentList{
		padding: 32rpx;
		
		.createBtn{
			width: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #000;
			padding: 6rpx 8rpx;
			border-radius: 8rpx;
			border: 1px solid #333;
		}
		
		.listItem{
			padding: 24rpx;
			border-radius: 16rpx;
			background: #f8f8f8;
			margin-top: 28rpx;
			display: flex;
			align-items: center;
			
			.itemLogo{
				width: 100rpx;
				border-radius: 12rpx;
				height: 100rpx;
				margin-right: 10px;
			}
			
			.itemContent{
				.title{
					font-size: 24rpx;
					color: #000;
				}
				
				.desc{
					font-size: 22rpx;
					color: #ddd;
					height: 36rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.message{
					font-size: 18rpx;
					color: #cccfd1;
				}
			}
		}
	}
		
	.reviewEnd{
		padding: 15px 0 60px;
		
		.logo{
			width: 450rpx;
			margin: 0 auto;
			display: block;
		}
	}
	.noLimit{
		padding: 15px 0 60px;
		
		.logo{
			width: 580rpx;
			margin: 0 auto;
			display: block;
		}
	}
</style>