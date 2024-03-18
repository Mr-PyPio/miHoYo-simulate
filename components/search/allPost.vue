<template>
	<view class="content"  :style="{'height': '100%'}" >
		<scroll-view :scroll-y="true" :style="{'height': '100%'}" 
			@scrolltolower="scrollBottom"
		>
			<view class="edition" v-if="editionData">
				<view class="editionTop">
					<view class="editionTopLeft">
						<image src="../../static/poseRequlay/screen.png" mode="widthFix" class="image"></image>
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
				<view class="gameRole" v-if="gameRoleData">
					<view class="roleMessageCard">
						<view class="roleMessageCardLeft">
							<view class="roleCard">
								<image :src="gameRoleData.icon|imageUrlReset(100,80)" mode="widthFix" class="roleIcon"></image>
								<image :src="gameRoleData.role_card_data_list[1].value|imageUrlReset(60,80)" mode="widthFix" class="roleElement"></image>
								<view class="roleRarity">
									<template v-for="(item,index) in rarityArr" >
										<image src="../../static/star.png" mode="widthFix" :key="index" v-if="index < rarityNum" class="image"></image>
									</template>
								</view>
							</view>
							<view class="roleMessage">
								<view class="roleMessageName">
									{{gameRoleData.name}}
								</view>
								<view class="roleMessageDesc">
									{{gameRoleData.role_card_data_list[2].name}}: {{gameRoleData.role_card_data_list[2].value}}
								</view>
							</view>
						</view>
						<view class="roleMessageCardRight">
							<image src="../../static/search/profile.png" mode="widthFix" class="image"></image>
							查看角色资料
						</view>
					</view>
					<view class="strategyList" @touchmove.stop="tochMoveStop" v-if="gameRoleData.strategy_list">
						<scroll-view scroll-x="true" style="width: 100%;" @scroll="strategyListScroll">
							<view class="scrollWrapper">
								<template v-for="(item,index) in gameRoleData.strategy_list" >
									<view class="listItems" v-if="index < 3" :key="index">
										<view class="itemsImage">
											<image :src="item.image|imageUrlReset(100,80)" mode="scaleToFill" class="image"></image>
										</view>
										<view class="itemsTitle" v-html="matchText(item.title)">
										</view>
									</view>
								</template>
							</view>
						</scroll-view>
					</view>
				</view>
				
				<view class="wikis" v-if="wikisData">
					<view class="wikisTop">
						相关百科
						<view class="wikisAll">
							全部
							<u-icon name="arrow-right" color="#999" size="20" style="margin-left: 2px;"></u-icon>
						</view>
					</view>
					<view class="wikisList">
						<template v-for="(item,index) in wikisData" >
							<view class="wikisListItems" :key="index" v-if="index < 2">
								<view class="itemsIcon">
									<image :src="item.icon|imageUrlReset(100,80)" mode="widthFix"></image>
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
				</view>
				
				<view class="wikis" v-if="searchMallData.list">
					<view class="wikisTop">
						相关商品
						<view class="wikisAll">
							全部
							<u-icon name="arrow-right" color="#999" size="20" style="margin-left: 2px;"></u-icon>
						</view>
					</view>
					<view class="wikisList">
						<template v-for="(item,index) in searchMallData.list" >
							<view class="wikisListItems searchMall" :key="index" v-if="index < 2">
								<view class="itemsIcon">
									<img :src="item.image_url|imageUrlReset(100,80)" style="width: 60rpx;height: 60rpx;" alt="" />
								</view>
								<view class="itemsMessage">
									<view class="itemsMessageName searchMall" v-html="matchText(item.title)">
									</view>
									<view class="itemsMessageName2 searchMall">
										￥
										<text class="searchMallAmount">
											{{item.amount}}
										</text>
									</view>
								</view>
								<view class="itemsTipc">
									
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
			<view class="postList" v-if="postData">
				<view v-for="(item,index) in postData"  :key="item.post_id">
					<SearchPostItem :item="item" :keyWord="keyWord"></SearchPostItem>
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
	import SearchPostItem from '../common/searchPostItem.vue'
	import {search,searchPost} from '../../common/api.js'
	export default {
		name: 'allPost',
		components: {
			SearchPostItem
		},
		data() {
			return {
				loading: true,
				postData: null,
				editionData: null,
				editionType: '原神板块',
				leftType: 'hot',
				gameRoleData: null,
				rarityArr: [1,2,3,4,5],
				wikisData: null,
				searchMallData: null,
				last_id: null,
				is_last: false,
				authorityFirst: true,
				encycleFirst: true,
				imageFirst: true,
				videoFirst: true,
				topicFirst: true,
				userFirst: true,
				strategyFirst: true,
				rarityNum: 0,
				keyWord: '',
				upDateLoading: false,
			}
		},
		methods: {
			async initEditionData() {
				const {data: res} = await search(this.keyWord)
				this.editionData = res.data
				this.gameRoleData  = res.data.game_role
				if(this.gameRoleData) {
					this.rarityNum = Number(this.gameRoleData.role_card_data_list[0].value)
				}
				this.wikisData = res.data.wikis
				this.searchMallData = res.data.search_mall_info
			},
			async initPostData() {
				const {data: res} = await searchPost(this.keyWord)
				const dataNew = res.data
				this.last_id = dataNew.last_id
				this.is_last = dataNew.is_last
				this.postData = dataNew.posts
				let timer = setTimeout(() => {
					this.loading = false
					clearTimeout(timer)
				},300)
			},
			initData(keyWord) {
				this.keyWord = keyWord
				this.initPostData()
				this.initEditionData()
			},
			tochMoveStop(event) {
				event.stopPropagation();
			},
			strategyListScroll(event) {
				
			},
			matchText(text) {
				const reg = new RegExp(`${this.keyWord}`,'g')
				return text.replace(reg, `<span style="color: #71e0fe">${this.keyWord}</span>`)
			},
			async scrollBottom() {
				if(!this.upDateLoading && !this.is_last) {
					this.upDateLoading = true
					const {data: res} = await searchPost(this.keyWord,0,this.last_id)
					const dataNew = res.data
					this.last_id = dataNew.last_id
					this.is_last = dataNew.is_last
					this.postData.push(...dataNew.posts)
					this.upDateLoading = false
				}
			}
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
					
					.image{
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
			
			.gameRole{
				padding-bottom: 30rpx;
				border-bottom: 6px solid #f8f8f8;
				
				.roleMessageCard{
					padding: 0 24rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.roleMessageCardLeft{
						display: flex;
						
						.roleCard{
							position: relative;
							width: 90rpx;
							height: 90rpx;
							
							.roleIcon{
								width: 90rpx;
								height: 90rpx;
								border-radius: 4px;
							}
							
							.roleElement{
								position: absolute;
								top: 1px;
								left: 1px;
								width: 30rpx;
								height: 30rpx;
							}
							
							.roleRarity{
								display: flex;
								align-items: center;
								position: absolute;
								bottom: -4px;
								left: 0;
								
								.image{
									width: 18rpx;
									
									&:last-of-type{
										margin-right: 0;
									}
								}
							}
						}					
						.roleMessage{
							margin-left: 8px;
							
							.roleMessageName{
								font-size: 30rpx;
								color: #71e0fe;
								padding-bottom: 4rpx;
								font-weight: 600;
							}
							
							.roleMessageDesc{
								color: #999;
								font-size: 24rpx;
							}
						}
					}
					
					.roleMessageCardRight{
						display: flex;
						align-items: center;
						font-size: 22rpx;
						color: #000;
						padding: 8rpx 12rpx;
						border: 1px solid #ddd;
						border-radius: 4px;
						
						.image{
							width: 30rpx;
							margin-right: 4rpx;
						}
					}
				}
				
				.strategyList{
					margin-top: 24rpx;
					
					.scrollWrapper{
						display: flex;
						
						.listItems{
							width: 240rpx;
							margin-right: 16rpx;
							
							&:last-of-type{
								margin-right: 0;
								padding-right: 24rpx;
							}
							&:first-of-type{
								margin-left: 24rpx;
							}
							
							.itemsImage{
								border-radius: 8px;
								width: 240rpx;
								height: 120rpx;
								overflow: hidden;
								
								.image{
									width: 240rpx;
									height: 120rpx;
								}
							}
							
							.itemsTitle{
								padding-top: 6px;
								font-size: 24rpx;
								line-height: 1.5em;
								color: #333;
								display: -webkit-box;
								overflow: hidden;
								text-overflow: ellipsis;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
							}
						}
					}
				}
			}
			
			.wikis{
				border-bottom: 6px solid #f8f8f8;
				padding: 24rpx;
				
				.wikisTop{
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: #000;
					font-weight: 600;
					margin-bottom: 24rpx;
					
					.wikisAll{
						font-weight: 500;
						display: flex;
						align-items: center;
						color: #999;
						font-size: 20rpx;
					}
				}
				
				.wikisList{
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.wikisListItems{
						width: 344rpx;
						background: #f8f8f8;
						padding: 10rpx;
						border-radius: 2px;
						display: flex;
						box-sizing: border-box;
						
						&.searchMall{
							border-radius: 8px;
						}
						
						.itemsIcon{
							width: 60rpx;
							height: 60rpx;
							display: flex;
							align-items: center;
							border-radius: 4px;
							overflow: hidden;
						}

						
						.itemsMessage{
							margin-left: 12rpx;
							
							.itemsMessageName{
								width: 252rpx;
								font-size: 24rpx;
								color: #71e0fe;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								
								&.searchMall{
									color: #000;
								}
							}
							
							.itemsMessageName2{
								font-size: 20rpx;
								color: #999;
								
								&.searchMall{
									color: #000;
									font-size: 18rpx;
									
									.searchMallAmount{
										font-size: 24rpx;
									}
								}
							}
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