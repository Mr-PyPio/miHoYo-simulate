<template>
	<view>
		<view :class="'lazyImageDetail'+index" :style="srcStyle">
			<image :src="src" :mode="mode" :lazy-load="true"  v-if="loading"></image>
			<image :src="loadSrc" mode="widthFix" :style="loadStyle" v-if="!loading"></image>
		</view>
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
			loadSrc: {
				type: String,
				default() {
					return ''
				}
			},
			mode: {
				type: String,
				default() {
					return ''
				}
			},
			index: {
				type: Number
			},
			srcStyle: {
				type: Object,
				default() {
					return {
						"width" : '100%'
					}
				}
			},
			loadStyle: {
				type: Object,
				default() {
					return {
						"width" : '100%',
						'height' : '100%'
					}
				}
			}
		},
		data() {
			return {
				loading: false
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.intersectionObserver = uni.createIntersectionObserver(this);
				this.intersectionObserver.relativeToViewport().observe(`.lazyImageDetail${this.index}`, (res) => {
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
	image{
		width: 100%;
		height: 100%;
	}
</style>