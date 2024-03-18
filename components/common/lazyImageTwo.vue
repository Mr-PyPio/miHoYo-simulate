<template>
		<view class="imageWrap" v-if="src" >
			<!-- #ifdef WEB -->
			<image :src="imageSrc" :mode="mode" :lazy-load="true" class="image"  :class="'lazyImageDetail' + index"></image>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<image :src="src" :mode="mode" :lazy-load="true" class="image"  :class="'lazyImageDetail' + index"></image>
			<!-- #endif -->
		</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default() {
					return ''
				}
			},
			mode: {
				type: String,
				default() {
					return 'aspectFill'
				}
			},
			index: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		// #ifdef WEB
		data() {
			return {
				intersectionObserver: null,
				imageSrc: '../../static/loadingImg.png'
			}
		},
		methods: {
			preload() {
				let image = new Image()
				if(this.src) {
					image.src = this.src
					image.onload = () => {
						this.imageSrc =  this.src
						this.intersectionObserver.disconnect()
					}
					image.onerror = () => {
						console.error(`有图片加载出错: ${ this.src}`)
						this.intersectionObserver.disconnect()
					}
				}
			},
		},
		mounted() {
			this.$nextTick(function() {
				if(this.src) {
					this.intersectionObserver = uni.createIntersectionObserver(this);
					this.intersectionObserver.relativeToViewport().observe(`.lazyImageDetail${this.index}`, (res) => {
					  if (res.intersectionRatio > 0) {
						this.preload()
					  }
					});
				}

			})
		},
		// #endif
	}
</script>

<style lang="scss" scoped>
	.image,.imageWrap{
		width: 100%;
		height: 100%;
	}
</style>