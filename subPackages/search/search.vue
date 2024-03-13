<template>
	<view class="search">
		<view class="searchWrap">
			<view class="searchInput" style="width: 610rpx;">
				<u--input style="width: 610rpx;" @input="keyWordInput"
						placeholder="前置图标" border="none" :color="inputColor" :value="inputKey"
						prefixIcon="search" :placeholder="placeholder" fontSize="26rpx"
						prefixIconStyle="font-size: 20px;color: #909399" @confirm="searchInput"
						@focus = "inputFocus"
					></u--input>
					
				<view class="texShadow" v-if="texShadow">
					{{texShadow}}
				</view>
			</view>
			<view class="cancelSearch" @tap.stop='goBack'>
				取消
			</view>
			<view class="close" v-if="serachKey" @tap.stop="cancleSearchClick">
				<u-icon name="close-circle" color="#909399" size="24"></u-icon>
			</view>
		</view>
		<template v-show="!hasPost">
			<scroll-view :scroll-y="scrollY" :style="{'height': windowHeight + 'px','width': '750rpx'}">
				<view class="otherContent">
					<view class="historyKey" v-if="historyKeyWordList.length">
						<view class="historyTop">
							<view class="topLeft">
								历史搜索
							</view>
							<view class="topRight" @tap.stop="clearHistoryKey">
								清空
							</view>
						</view>
						<view class="historyList">
							<view class="historyListItem" v-for="(item,index) in historyKeyWordList" :key="index" v-if="index < 2" @tap="search(item)">
								{{item}}
							</view>
							
							<template v-if="historyAllShow">
								<view class="historyListItem" v-for="(item,index) in historyKeyWordList" :key="index" v-if="index > 1"  @tap="search(item)">
										{{item}}
								</view>
							</template>
							
							<view class="historyAllShow" @tap.stop="historyAllShowClick" v-if="!historyAllShow && historyKeyWordList.length > 2">
								<u-icon name="arrow-down" color="#999" size="28"></u-icon>
							</view>
						</view>
					</view>
					
					<view class="hotKey" v-if="hotKeyList">
						<view class="hotKeyTop">
							原神热搜
						</view>
						<view class="hotKeyList">
							<view class="hotKeyListItem" v-for="(item,index) in hotKeyList" :key="index" @tap="search(item.keyword)">
								{{item.keyword}}
								<image src="../../static/hot.png" mode="widthFix" class="hotLogo" v-if="index < 3"></image>
							</view>
						</view>
					</view>
					
					<view class="new" v-if="newList">
						<view class="newTop">
							近期活动
						</view>
						
						<view class="newImage" v-for="(item,index)  in newList" :key="index">
							<image :src="item.cover" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</template>
		<template v-if="hasPost">
			<search-post ref="serachPost"></search-post>
		</template>
		
		<view class="popupList" v-show="popupShow">
			<view class="keyWordList" v-if="predict_villa && predict_villa.villa">
				<view class="listItems">
					<image :src="predict_villa.villa.villa_avatar_url" mode="heightFix"></image>
					<view class="message">
						<view class="name">
							{{predict_villa.villa.name}}
						</view>
						<view class="desc">
							粉丝:{{predict_villa.villa.introduce}}
						</view>
					</view>
					<view class="type">
						别野
					</view>
				</view>
			</view>
			<view class="keyWordList" v-if="predict_user">
				<view  class="listItems">
					<image :src="predict_user.avatar_url" mode="heightFix"></image>
					<view class="message">
						<view class="name">
							{{predict_user.nickname}}
						</view>
						<view class="desc">
							粉丝:{{predict_user.achieve.followed_cnt|resetNum}}
						</view>
					</view>
					<view class="type">
						用户
					</view>
				</view>
			</view>
			<view class="keyWordList" v-if="predict_topic">
				<view class="listItems">
					<image :src="predict_topic.cover" mode="heightFix"></image>
					<view class="message">
						<view class="name">
							{{predict_topic.name}}
						</view>
						<view class="desc">
							{{predict_topic.desc}}
						</view>
					</view>
					<view class="type">
						话题
					</view>
				</view>
			</view>
			<view class="keyWordList" v-if="predict_words">
				<view v-for="(item,index) in predict_words" :key="index" class="listItems" @tap="search(item)">
					{{item}}
				</view>
			</view>
		</view>
			<img-pop-up></img-pop-up>
	</view>
</template>

<script>
	import {searchNew,getSiteHotKeyword,searchPreKeyword,predictUGC} from '../../common/api.js'
	import SearchPost from '../../components/search/searchPost.vue'
	import ImgPopUp from '@/components/common/imgPopUp.vue'
	export default {
		data() {
			return {
				popupShow: false,
				placeholder: '',
				historyAllShow: false,
				hotKeyList: null,
				newList: null,
				predict_topic: null,
				predict_user: null,
				predict_villa: null,
				predict_words: null,
				scrollY: true,
				historyKeyWordList: [],
				hasPost: false,
				inputColor: '#ddd',
				inputKey: '',
				serachKey: '',
				inClickToSearch: false,
				texShadow: '',
			};
		},
		components: {
			SearchPost,
			ImgPopUp
		},
		methods: {
			async init() {
				const {data: plaKey} = await searchPreKeyword()
				this.placeholder = plaKey.data.list[0]
				const {data: hotKey} = await getSiteHotKeyword()
				this.hotKeyList = hotKey.data.list
				const {data: newRes} = await searchNew()
				this.newList = newRes.data.carousels.data
			},
			goBack() {
				uni.navigateBack()
			},
			historyAllShowClick(){
				this.historyAllShow = true
			},
			async keyWordInput(value) {
				if(this.inClickToSearch) return
				if(value) {
					this.scrollY = false
					this.popupShow = true
					this.inputColor = '#000'
				}
				const {data: res} = await predictUGC(value)
				this.predict_topic = res.data.predict_topic
				this.predict_user = res.data.predict_user
				this.predict_villa = res.data.predict_villa
				this.predict_words = res.data.predict_words
				console.log(res,4)
			},
			async search(key) {
				this.inClickToSearch = true
				this.hasPost = true
				this.$nextTick(function() {
					this.$refs.serachPost.init(key)
					this.serachKey = key
					this.inputKey = key
				})
				this.scrollY = true
				this.popupShow = false
				this.inputColor = '#000'
				const index = this.historyKeyWordList.indexOf(key)
				if(index > -1) {
					this.historyKeyWordList.splice(index,1)
				}
				this.historyKeyWordList.unshift(key)
				uni.setStorageSync('historyKeyWord',this.historyKeyWordList)
			},
			searchInput(value) {
				if(!value) {
					this.search(this.placeholder)
				}else{
					this.search(value)
				}
			},
			cancleSearchClick() {
				this.popupShow = false
				this.predict_topic = null
				this.predict_user = null
				this.predict_villa = null
				this.predict_words = null
				this.predict_villa = null
				this.scrollY = true
				this.hasPost = false
				this.inputColor = '#ddd'
				this.inputKey = ''
			},
			async inputFocus() {
				this.inClickToSearch = false
				const {data: res} = await predictUGC(this.inputKey)
				this.predict_topic = res.data.predict_topic
				this.predict_user = res.data.predict_user
				this.predict_villa = res.data.predict_villa
				this.predict_words = res.data.predict_words
				this.popupShow = true
				console.log(res,3)
			},
			clearHistoryKey() {
				this.historyKeyWordList = []
				uni.removeStorageSync('historyKeyWord')
			},
		},
		onLoad(option) {
			const initKeyword = option.keyword
			if(initKeyword) {
				this.search(initKeyword)
			}
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
			const historyKeyWordsList = uni.getStorageSync('historyKeyWord') ? uni.getStorageSync('historyKeyWord') : []
			if(historyKeyWordsList) {
				this.historyKeyWordList = historyKeyWordsList
			}
			this.init()
		}
	}
</script>

<style lang="scss">
.search{
	position: relative;
	
	.searchWrap{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 24rpx 12rpx;
		background: #f8f8f8;
		position: fixed;
		top: 0;
		left: 0;
		width: 750rpx;
		box-sizing: border-box;
		z-index: 100;
		
		.searchInput{
			background: #fff;
			border-radius: 4px;
			padding: 4rpx 8rpx;
			position: relative;
			
			.texShadow{
				font-size: 26rpx;
				color: #000;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: calc(8rpx + 24px);
				background: #fff;
				height: 48rpx;
				line-height: 48rpx;
			}
		}
		
		.cancelSearch{
			font-size: 24rpx;
			color: #222;
		}
		
		.close{
			position: absolute;
			width: 56rpx;
			height: 56rpx;
			left: 586rpx;
			top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 100;
		}
	}
	
	.otherContent{
		padding: 98rpx 24rpx 24rpx;
		position: relative;
		
		.historyKey{
			padding-top: 24rpx;
			
			.historyTop{
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.topLeft{
					font-size: 26rpx;
					color: #000;
					font-weight: 600;
				}
				
				.topRight{
					font-size: 20rpx;
					color: #999;
				}
			}
			
			.historyList{
				margin-top: 30rpx;
				display: flex;
				flex-wrap: wrap;
				position: relative;
				width: 100%;
				
				.historyListItem{
					height: 48rpx;
					font-size: 24rpx;
					line-height: 48rpx;
					background: #f8f8f8;
					color: #333;
					padding: 0 20rpx;
					margin-right: 12rpx;
					margin-bottom: 12rpx;
				}
				
				.historyAllShow{
					height: 48rpx;
					width: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #f8f8f8;
					top: 0;
					right: 0;
					position: absolute;
				}
			}
		}
		
		
		.hotKey{
			margin-top: 40rpx;
			.hotKeyTop{
				font-size: 26rpx;
				color: #000;
				font-weight: 600;
			}
			
			.hotKeyList{
				display: flex;
				flex-wrap: wrap;
				
				.hotKeyListItem{
					margin-top: 30rpx;
					font-size: 24rpx;
					color: #333;
					width: 50%;
					
					.hotLogo{
						width: 24rpx;
						margin-left: 20rpx;
					}
				}
			}
		}
		
		.new{
			margin-top: 40rpx;
			.newTop{
				font-size: 26rpx;
				color: #000;
				margin-bottom: 24rpx;
				font-weight: 600;
			}
			
			.newImage{
				margin-bottom: 24rpx;
				font-size: 0;
				
				image{
					width: 100%;
					border-radius: 8px;
				}
			}
		}
	}
	.popupList{
		width: 750rpx;
		height: calc(100vh - 98rpx);
		background: #fff;
		z-index: 10;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		top: 98rpx;
		left: 0;
		
		.listItems{
			font-size: 24rpx;
			color: #222;
			padding: 26rpx 0;
			border-bottom: 1px solid #f8f8f8;
			position: relative;
			display: flex;
			align-items: center;
			
			image{
				height: 64rpx;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
			
			.message{
				font-size: 28rpx;
				color: #000;
				
				.desc{
					font-size: 20rpx;
					color: #999;
				}
			}
			
			.type{
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style>
