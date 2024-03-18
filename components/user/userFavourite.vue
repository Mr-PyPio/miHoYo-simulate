<template>
	<scroll-view scroll-y="true" style="height: 100%;"  @scrolltolower="scrolltolower">
		<view class="contentList">
			<view class="postList" v-if="postData">
				<view v-for="(item,index) in postData"  :key="item.post.post_id" class="postListItem">
					<PostItems :item="item"></PostItems>
				</view>
			</view>
			<view class="reviewEnd" v-if="allShow">
				<image src="../../static/poseRequlay/reviewEnd.png" mode="widthFix" class="logo"></image>
			</view>
			<view class="noLimit" v-if="!limit">
				<image src="../../static/user/noLimit.png" mode="widthFix" class="logo"></image>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import PostItems from '../common/postItems.vue'
	import {getUserFavourite} from "../../common/api.js"
	export default {
		components: {
			PostItems
		},
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
				next_offset: null
			}
		},
		computed: {
			allShow() {
				return this.is_last
			},
		},
		methods: {
			async getDate() {
				const {data: res} = await getUserFavourite(this.uid)
				if(res.message === "权限不足") {
					this.limit = false
				}
				if(res.data) {
					this.postData = res.data.list
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
				}
			},
			async loadMoreDate() {
				const {data: res} = await getUserFavourite(this.uid,this.next_offset)
				if(res.data) {
					this.postData.push(...res.data.list)
					this.is_last = res.data.is_last
					this.next_offset = res.data.next_offset
				}
			},
			scrolltolower() {
				if(!this.is_last) {
					this.loadMoreDate()
				}
			}
		},
		created() {
			this.getDate()
		}
	}
</script>

<style lang="scss" scoped>
	.contentList{
		.postListItem{
			border-bottom: 1px solid #f5f5f5;
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
	}
</style>