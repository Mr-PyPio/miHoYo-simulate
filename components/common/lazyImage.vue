<template>
		<view class="imageWrap" v-if="imageData" >
			<image :src="imageSrc" :mode="mode" :lazy-load="true" class="image"  :class="'lazyImageDetail' + imageData.image_id"></image>
		</view>
</template>

<script>
	export default {
		props: {
			imageData: {
				type: Object,
				default() {
					return {}
				}
			},
			mode: {
				type: String,
				default() {
					return 'aspectFill'
				}
			}
		},
		data() {
			return {
				loading: false,
				intersectionObserver: null,
				imageSrc: '../../static/loadingImg.png'
			}
		},
		methods: {
			preload() {
				let image = new Image()
				if(this.imageData) {
					const url = this.imageUrlReset(this.imageData.url,300,80)
					image.src = url
					image.onload = () => {
						this.imageSrc = url
						this.intersectionObserver.disconnect()
					}
					image.onerror = () => {
						console.error(`有图片加载出错: ${url}`)
						this.intersectionObserver.disconnect()
					}
				}
			},
			imageUrlReset(url,s,q) {
					const reg = /.gif/g
					const matches = url.match(reg);
					
					if(matches) {
						return url
					}else {
						const urlArr = url.split('?')
						return urlArr[0] + `?x-oss-process=image/resize,s_${s}/quality,q_${q}/auto-orient,0/interlace,1/format,png`
					}
			},
		},
		mounted() {
			this.$nextTick(function() {
				if(this.imageData) {
					this.intersectionObserver = uni.createIntersectionObserver(this);
					this.intersectionObserver.relativeToViewport().observe(`.lazyImageDetail${this.imageData.image_id}`, (res) => {
					  if (res.intersectionRatio > 0) {
						this.preload()
					  }
					});
				}

			})
		},
	}
</script>

<style lang="scss" scoped>
	.image,.imageWrap{
		width: 100%;
		height: 100%;
	}
</style>