<template>
	<view>
		<view class="otherModulItem otherModul" :style="{'right': message.module1.right,'z-index': message.module1.zIndex}">
			<view class="postReplay positionAbsolute" v-if="message.module1.showType === 'postReplay'" >
				<post-replay  ref="postReplay" :post_id = "message.module1.post_id"></post-replay>
			</view>
			<view class="artical positionAbsolute" v-if="message.module1.showType === 'artical'" >
				<Artical ref="artical" :post_id = "message.module1.post_id"></Artical>
			</view>
			<view class="user positionAbsolute" v-if="message.module1.showType === 'user'" >
				<User ref="user" :uid = "message.module1.post_id"></User>
			</view>
			<view class="search positionAbsolute" v-if="message.module1.showType === 'search'" >
				<Search ref="search" :initKeyword = "message.module1.post_id"></Search>
			</view>
		</view>
		<view class="otherModulItem otherModul" :style="{'right': message.module2.right,'z-index': message.module2.zIndex}">
			<view class="postReplay positionAbsolute" v-if="message.module2.showType === 'postReplay'" >
				<post-replay  ref="postReplay" :post_id = "message.module2.post_id"></post-replay>
			</view>
			<view class="artical positionAbsolute" v-if="message.module2.showType === 'artical'" >
				<Artical ref="artical" :post_id = "message.module2.post_id"></Artical>
			</view>
			<view class="user positionAbsolute" v-if="message.module2.showType === 'user'" >
				<User ref="user" :uid = "message.module2.post_id"></User>
			</view>
			<view class="search positionAbsolute" v-if="message.module2.showType === 'search'" >
				<Search ref="search" :initKeyword = "message.module2.post_id"></Search>
			</view>
		</view>
		<view class="otherModulItem otherModul" :style="{'right': message.module3.right,'z-index': message.module3.zIndex}">
			<view class="postReplay positionAbsolute" v-if="message.module3.showType === 'postReplay'" >
				<post-replay  ref="postReplay" :post_id = "message.module3.post_id"></post-replay>
			</view>
			<view class="artical positionAbsolute" v-if="message.module3.showType === 'artical'" >
				<Artical ref="artical" :post_id = "message.module3.post_id"></Artical>
			</view>
			<view class="user positionAbsolute" v-if="message.module3.showType === 'user'" >
				<Search ref="user" :uid = "message.module3.post_id"></Search>
			</view>
			<view class="search positionAbsolute" v-if="message.module3.showType === 'search'" >
				<Search ref="search" :initKeyword = "message.module3.post_id"></Search>
			</view>
		</view>
</view>
</template>

<script>
	import PostReplay from '@/components/postReplay/postReplay.vue'
	import Artical from '@/components/postReplay/artical.vue'
	import User from '@/components/user/user.vue'
	import Search from '@/components/search/search.vue'
	import {mapState,mapMutations} from 'vuex'
	export default{
		components: {
			PostReplay,
			Artical,
			User,
			Search
		},
		data() {
			return {
				bottomTabHeight: 0,
				message: {
					module1: {
						right: '-100%',
						post_id: null,
						showType: '',
						zIndex: 1000
					},
					module2: {
						right: '-100%',
						post_id: null,
						showType: '',
						zIndex: 1000
					},
					module3: {
						right: '-100%',
						post_id: null,
						showType: '',
						zIndex: 1000
					}
				},
				pageModuleHistory:[],
				showModulNumber: 0,
				max_zIndex: 1100,
				min_zIndex: 1000
			}
		},
		computed: {
			...mapState(['windowHeight','rpxNum']),
			otherModulHeight() {
				return this.windowHeight*this.rpxNum - this.bottomTabHeight + 'rpx'
			}
		},
		methods: {
			...mapMutations(['updateWindowHeight']),
			initListenFunction() {
				uni.$on('navPage',(type,post_id) => {
					this.showModulNumber += 1
					// #ifdef MP-WEIXIN
					const oldHeight = this.windowHeight
					if(this.showModulNumber === 1) {
						wx.hideTabBar()
						this.updateWindowHeight({
							height : oldHeight + 50,
						})
					}
					// #endif
					const Num = this.getNumber()
					this.judgeShowPage()
					this.message[`module${Num}`].post_id = post_id
					this.message[`module${Num}`].showType = type
					this.message[`module${Num}`].right = 0
					this.pageModuleHistory.push({
						type,
						post_id
					})
				})
				uni.$on('navGoBack',(type) => {
					// #ifdef MP-WEIXIN
					const oldHeight = this.windowHeight
					if(this.showModulNumber === 1) {
						wx.showTabBar()
						this.updateWindowHeight({
							height : oldHeight - 50,
						})
					}
					// #endif
					const Num = this.getNumber()
					this.judegBackPage()
					this.message[`module${Num}`].right = '-100%'
					this.message[`module1`].zIndex = this.min_zIndex
					let timer = setTimeout(() => {
						this.message[`module${Num}`].post_id = ''
						this.message[`module${Num}`].showType = ''
						clearTimeout(timer)
					},500)
					this.pageModuleHistory.pop()
					this.showModulNumber -= 1
				})
			},
			getNumber() {
				const length = this.showModulNumber
				if(length > 3) {
					return length % 3
				}else{
					return length
				}
			},
			judgeShowPage() {
				if(this.showModulNumber % 3 === 0) {
					this.message[`module1`].post_id = ''
					this.message[`module1`].showType = 'type'
					this.message[`module1`].right = '-100%' 
				}
				if(this.showModulNumber % 3 === 1 && this.showModulNumber > 2) {
					this.message[`module1`].zIndex = this.max_zIndex
				}
			},
			judegBackPage() {
				if(this.showModulNumber % 3 === 0) {
					const data =  this.pageModuleHistory[this.showModulNumber - 3]
					this.message[`module1`].zIndex = this.min_zIndex
					this.message[`module1`].post_id = data.post_id
					this.message[`module1`].showType = data.type
					this.message[`module1`].right = 0 
				}
			},
		},
		created() {
			this.initListenFunction()
		}
	}
</script>

<style lang="scss" scoped>
.otherModul{
	position: fixed;
	height: 100%;
	top: 0;
	width: 100%;
	transition-duration: 500ms;
	background: #fff;
}
.positionAbsolute{
	position: absolute;
	height: 100%;
	top: 0;
	width: 100%;
	z-index: 10000;
	right: 0;
}
</style>