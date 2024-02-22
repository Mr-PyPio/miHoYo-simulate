<template>
	<scroll-view scroll-y="true" :style="{'height': windowHeight*rpxNum - 80  + 'rpx'}">
		<view class="contentList" style="height: 10000px;">
			getUserCollection
		</view>
	</scroll-view>
</template>

<script>
	import {getUserCollection} from "../../common/api.js"
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
				const {data: res} = await getUserCollection('331357100')
				console.log(res,'Collection')
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