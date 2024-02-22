<template>
	<view class="content" :style="{'height': scrollHeight}">
		<scroll-view :scroll-y="true" :style="{'height': scrollHeight}" @scrolltolower="scrollBottom">
			<view class="edition">
				<view class="editionTop">
					<view class="editionTopLeft">
						<image src="../../static/poseRequlay/screen.png" mode="widthFix"></image>
						{{editionType}}
					</view>
					<view class="editionTopRight">
						<view class="leftType" :class="{'active': leftType === 'hot'}">
							按热度
						</view>
						<view class="leftType" :class="{'active': leftType === 'time'}">
							按时间
						</view>
					</view>
				</view>
			</view>
			<view class="grid">
				<image :src="gridSrc" mode="widthFix" @tap.stop="gridChange"></image>
			</view>
			<view class="postList" v-if="wikisData">
				<view class="wikisList">
					<template v-for="(item,index) in wikisData" >
						<view class="wikisListItems" :class="{'wikisListItemsOne': typeTurn}" :key="index" >
							<view class="itemsIcon">
								<image :src="item.icon|imageUrlReset(100,80)" mode="aspectFill" class="itemsIconImg"></image>
							</view>
							<view class="itemsMessage">
								<view class="itemsMessageName" v-html="matchText(item.title)">
								</view>
								<view class="itemsMessageName2">
									{{item.channel_name[0]}}
								</view>
							</view>
						</view>
					</template>
				</view>
				
				<view class="loading2">
					<u-loading-icon mode="circle" size="42"></u-loading-icon>
				</view>
			</view>
		</scroll-view>
		<image src="../../static/search/loading1.gif" mode="widthFix" class="loading" v-if="loading"></image>
	</view>
</template>

<script>
	import {searchAllWiki} from '../../common/api.js'
	export default {
		name: 'encyclePost',
		data() {
			return {
				loading: false,
				scrollHeight: 0,
				wikisData: null,
				editionType: '原神板块',
				leftType: 'hot',
				last_id: null,
				is_last: false,
				typeTurn: true,
				gridSrc: '../../static/search/grid.png',
				keyWord: '',
				upDateLoading: false,
			}
		},
		methods: {
			async initData(keyWord) {
				this.loading = true
				this.keyWord = keyWord
				const {data : res} = await searchAllWiki(this.keyWord)
				const dataNew = res.data
				this.last_id = dataNew.last_id
				this.is_last = dataNew.is_last
				this.wikisData = dataNew.wikis
				setTimeout(() => {
					this.loading = false
				},300)
			},
			async scrollBottom() {
				if(!this.upDateLoading && !this.is_last) {
					this.upDateLoading = true
					const {data: res} = await searchAllWiki(this.keyWord,this.last_id)
					const dataNew = res.data
					this.last_id = dataNew.last_id
					this.is_last = dataNew.is_last
					this.wikisData.push(...dataNew.wikis)
					this.upDateLoading = false
				}
			},
			matchText(text) {
				const reg = new RegExp(`${this.keyWord}`,'g')
				return text.replace(reg, `<span style="color: #71e0fe">${this.keyWord}</span>`)
			},
			gridChange() {
				if(this.typeTurn) {
					this.gridSrc = '../../static/search/grid2.png'
					this.typeTurn = false
				}else{
					this.gridSrc = '../../static/search/grid.png'
					this.typeTurn = true
				}
			}
		},
		created() {
			uni.getSystemInfo({
				success: res => {
					const rpxNum = 750 / res.windowWidth
					this.rpxNum = rpxNum
					this.windowHeight = res.windowHeight * rpxNum
					this.windowWidth = res.windowWidth * rpxNum
					this.scrollHeight = this.windowHeight - 178 + 'rpx'
				}
			})
		},
	}
</script>

<style lang="scss" scoped>
	
	.loading{
		width: 400rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.content{
		.edition{
			.editionTop{
				padding: 24rpx;
				display: flex;
				justify-content: space-between;
				font-size: 20rpx;
				color: #333;
				
				.editionTopLeft{
					height: 48rpx;
					line-height: 48rpx;
					display: flex;
					align-items: center;
					padding: 0 14rpx;
					border: 1px solid #f8f8f8;
					box-sizing: border-box;
					
					image{
						width: 24rpx;
						margin-right: 10rpx;
					}
				}
				
				.editionTopRight{
					height: 48rpx;
					line-height: 48rpx;
					display: flex;
					align-items: center;
					background: #fff;
					
					.leftType{
						padding: 0 12rpx;
						background: #f8f8f8;
						color: #999;
						box-sizing: border-box;
						
						&.active{
							border: 1px solid #f8f8f8;
							background: #fff;
							color: #333;
						}
					}
	
				}
			}
		}
		
		.grid{
			padding: 0 24rpx 24rpx;
			height: 40rpx;
			
			image{
				float: right;
				width: 40rpx;
				height: 40rpx;
			}
		}
		
		.postList {
			padding:0 24rpx 24rpx;
			.wikisList{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				align-items: center;
				
				.wikisListItems{
					width: 344rpx;
					background: #f8f8f8;
					padding: 10rpx;
					border-radius: 2px;
					display: flex;
					box-sizing: border-box;
					margin-bottom: 16rpx;
					
					&.wikisListItemsOne{
						width: 100%;
						
						.itemsMessageName{
							width: 580rpx !important;
						}
					}
					
					.itemsIcon{
						width: 70rpx;
						height: 70rpx;
						display: flex;
						align-items: center;
						border-radius: 6px;
						overflow: hidden;
						
						.itemsIconImg{
							width: 70rpx;
							height: 70rpx;
						}
					}
			
					
					.itemsMessage{
						margin-left: 12rpx;
						
						.itemsMessageName{
							width: 240rpx;
							font-size: 24rpx;
							color: #000;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						
						.itemsMessageName2{
							font-size: 20rpx;
							color: #999;
						}
					}
				}
			}
		}
	}

	.loading2{
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
	}
</style>