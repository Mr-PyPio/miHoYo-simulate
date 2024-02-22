<template>
	<scroll-view scroll-y="true" :style="{'height': windowHeight*rpxNum - 80  + 'rpx'}">
		<view class="contentList" style="height: 10000px;">
			getUserFavourite
		</view>
	</scroll-view>
</template>

<script>
	import {getUserFavourite} from "../../common/api.js"
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
				detailData: null
			}
		},
		methods: {
			async getDate() {
				const {data: res} = await getUserFavourite(this.uid)
				console.log(res,"Favourite")
			}
		},
		created() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight
				}
			})
			this.getDate()
		}
	}
</script>

<style lang="scss" scoped>
	.contentList{
		
	}
</style>