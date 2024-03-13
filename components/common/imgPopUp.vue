<template>
	<view class="imgFixWrapp" v-if="imgFixWrappShow" @tap.stop="tapImgFixWrapper" >
		<view class="imgPopUp" >
			<view class="popUpTop">
				<view class="popUpTopLeft">
					{{imgShowIndex+1}}/{{imgList.length}}
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="popUpTopRight" @tap.stop="saveImage">
					<u-icon color="#fff" size="30" name="more-dot-fill"></u-icon>
				</view>
				<!-- #endif -->
			</view>
			<swiper :current="imgShowIndex" @change="swiperChange"
				style="height: 80vh;margin-top: 10vh;overflow: hidden;">
				<swiper-item v-for="(item,key) in imgList" :key="key">
					<view class="swiper-item">
						<image :src="item.url" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
			
			<!-- #ifdef MP-WEIXIN -->
			<view class="" @tap.stop="popUpClick">
				<u-popup :show="show" mode="bottom" :overlay="true" :overlayOpacity="0.3" :round="24" ref="popupref"
					:safeAreaInsetBottom="false">
					<view class="saveLogo"  @tap="save">
						<view class="saveLogoImg">
							<image src="../../static/upDate2.png" mode="widthFix"></image>
						</view>
						<view class="saveText">保存</view>
					</view>
					<view class="cancel" @tap="cancel">
						取消
					</view>
				</u-popup>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	export default {
		data() {
			return{
				show: false,
			}
		},
		computed: {
			...mapState(['imgFixWrappShow','imgList','imgShowIndex'])
		},
		methods: {
			...mapMutations(['updateImageData','updateImgShowIndex']),
			swiperChange(e) {
				this.updateImgShowIndex(e.detail.current)
			},
			tapImgFixWrapper() {
				this.updateImageData({
					show: false,
					list: [],
					showIndex: 0
				})
			},
			// #ifdef MP-WEIXIN
			saveImage() {
				this.show = true
			},
			cancel() {
				this.show = false
			},
			popUpClick(e) {
				this.show = false
			},
			save() {
				uni.downloadFile({
					url: this.imgList[this.imgShowIndex].url,
					success: function (res) {
						const tempFilePath = res.tempFilePath;
						if(res.statusCode == 200) {
							uni.getFileSystemManager().saveFile({
								tempFilePath: tempFilePath,
								success: function (saveRes) {
									console.log(saveRes)
								},
								fail(err) {
								  console.error('saveFile fail:', err);
								}
							})
						}else {
						  console.error('Download file failed, status code:', downloadRes.statusCode);
						}
					},
					fail(err) {
						console.error('Download file failed:', err);
					}
				})
			}
			// #endif
		},
	}
</script>

<style lang="scss" scoped>
	.imgFixWrapp{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 1);
		z-index: 999;
	}
	.swiper-item{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		
		image{
			width: 98%;
		}
	}
	
	.imgPopUp{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		
		.popUpTop{
			position: absolute;
			top: 20px;
			left: 0;
			padding: 0 32rpx;
			display: flex;
			justify-content: space-between;
			width: 100%;
			box-sizing: border-box;
			
			.popUpTopLeft{
				color: #fff;
				font-size: 24rpx;
			}
		}
	}		
	
	.saveLogo{
		padding: 20px 32rpx 10px;
		box-sizing: border-box;
		
		.saveLogoImg{
			width: 64rpx;
			height: 64rpx;
			border-radius: 64rpx;
			background: #f8f8f8;
			display: flex;
			justify-content: center;
			align-items: center;
			
			image{
				width: 16px;
				height: 16px;
			}
		}
		
		.saveText{
			text-align: center;
			width: 64rpx;
			color: #000;
			font-size: 20rpx;
			padding-top: 4px;
		}
	}
	
	.cancel{
		background: #f8f8f8;
		height: 46px;
		font-size: 24rpx;
		color: #000;
		text-align: center;
		line-height: 46px;
		width: 100%;
	}

</style>