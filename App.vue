<script>
	import {mapMutations,mapActions} from 'vuex'
	export default {
		methods: {
			...mapMutations(['updateWindowHeight','updateEmotion','updateEmotionKey']),
			...mapActions(['initEmotionData'])
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.updateWindowHeight({
						height:res.windowHeight,
						rpxNum: rpxNum,
						windowWidth: res.windowWidth
					})
					uni.hideTabBar()
					this.initEmotionData()
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
