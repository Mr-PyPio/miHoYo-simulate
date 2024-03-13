<template>
	<view>
		<view class="userMessageWrap" v-if="item.user" @tap.stop="navigateToUser(item.user.uid)">
			<view class="userImage">
				<image :src="item.user.avatar_url|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarImage"></image>
				<image :src="item.user.pendant|imageUrlReset(50,80)" mode="aspectFill" class="userAvatarFrameImage" v-if="item.user.pendant"></image>
					<image v-if="item.user.certification && item.user.certification.type"
					:src="`../../static/poseRequlay/certificate${item.user.certification.type}.png`" mode="widthFix" class="certificate">
				</image>
			</view>
			<view class="userMessage">
				<view class="userName">
					{{item.user.nickname}}
					<image :src="`https://bbs-static.miyoushe.com/level/level${item.user.level_exp.level}.png`" 
						mode="heightFix" class="levelLogo">
					</image>
				</view>
				<view class="userLabel">
					{{item.user|getUserLabel}}
				</view>
			</view>
		</view>		
		<view class="reviewsContent">
			<view class="postmasterReviewWrap">
				<view class="postmasterReview" :class="{'morePostReview': item.reply.content.length > 300}" v-html="textParse(item.reply.content)"></view>
				<view class="openMore" v-if="item.reply.content.length > 300">
					展开完整评论  <u-icon name="arrow-down" color="#71e0fe" size="24" style="position: relative;top: 3rpx;left: 6rpx;"></u-icon>
				</view>
			</view>
			<view class="otherReview" v-if="item.sub_replies.length">
				<view class="otherReviewList" v-for="(review,key) in item.sub_replies" :key="key" v-if="key < 2">
					<rich-text :nodes="contentSplice(review)"></rich-text>
				</view>
				<view class="allOtherReviewNum" v-if="item.sub_reply_count > 2">
					全部{{item.sub_reply_count}}条评论
					<u-icon name="arrow-right" color="#999" size="24" style="position: relative;top: 3rpx;"></u-icon>
				</view>
			</view>			
			<view class="reviewMessage">
				<view class="reviewTime">
					{{item.reply.created_at|changeMonAndDay}}
				</view>
				<view class="reviewMessageRight">
					<view class="reply">
						<image src="../../static/reply.png" mode="heightFix"></image>
						回复
					</view>
					<view class="praise">
						<u-icon name="thumb-up" color="#b3b3b3" size="28" style="padding-right: 2px;"></u-icon>
						{{item.stat.like_num|resetLike}}
					</view>
					<view class="trample">
						<u-icon name="thumb-down" color="#b3b3b3" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			},
		},
		created() {
		},
		methods: {
			textParse(text) {
				const regex = /_\((.*?)\)/g;
				const matches = text.match(regex);
				let emotion = uni.getStorageSync('emotion')
				
				const regex2 = /<img\b[^>]*src=['"]([^'"]*)['"][^>]*>/g;
				
				text = text.replace(regex2, function(match, src) {
				  // 在匹配到的<img>标签后添加style属性
				  const style = "style='width: 100px; border-radius: 6px; display: block;'";
				  return `<img src='${src}' ${style}>`;
				});
				if(matches) {
					let newMatch = []
					for(let i = 0; i < matches.length; i ++) {
						if(!newMatch.includes(matches[i])) {
							newMatch.push(matches[i])
						}
					}
					for(let i = 0; i < newMatch.length; i ++ ) {
						let isReturn = false
						for(let k = 0; k < emotion.list.length; k ++) {
							const item = emotion.list[k]
							if(item.list) {
								const itemLength = item.list.length
								for(let f = 0; f < itemLength ; f ++) {
									const item2 = item.list[f]
									if(`_(${item2.name})` === newMatch[i]) {
										isReturn = true
										const reg = new RegExp(`_\\(${item2.name}\\)`,'g')
										const imageHtml = `<img src="${item2.icon}"  style="height: 36px;margin-left: 5px;display:inline-block;vertical-align: bottom"></img>`
										return text.replace(reg, imageHtml);
									}
								}
							}else{
								return
							}
							if(isReturn) {
								return
							}
						}
					}
				}
				return text.replace(/\n/g, '<br><br>');
			},
			contentSplice(item) {
				let image = ''
				const name = item.user.nickname
				const replyContent = this.textParse(item.reply.content)
				if(item.is_lz) {
					image = `<image src="../../static/poseRequlay/lz.png" mode="heightFix" style="height: 12px;display: inline-block;padding: 0 3px;top: 2px;position:relative"></image>`
				}
				const html = `
					<div  style="display: inline;color: #71e0fe;">
						${name}
						${image}
					</div>:&nbsp;
					<div  style="display: inline">
						${replyContent}
					</div>
				`
				return html
			},
			navigateToUser(uid) {
				uni.navigateTo({
					url: `/subPackages/user/user?uid=${uid}`,
				})
			}
		},
		filters: {
			getUserLabel(data) {
				if(data.certification && data.certification.label) {
					return data.certification.label
				}else if(data.ip_region){
					return '来自' + data.ip_region
				}else if(data.introduce){
					return data.introduce
				}else{
					return ''
				}
			},
			changeMonAndDay(value) {
				const date = new Date(parseInt(value) * 1000)
				const createDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				const createMon = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${createMon}-${createDay}`
			},
			resetLike(num) {
				if(num > 0) {
					return num
				}else{
					return '赞'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userMessageWrap{
		margin-top: 15px;
		display: flex;
		align-items: center;
		height: 64rpx;
		position: relative;
		
		.userImage{
			width: 64rpx;
			height: 64rpx;
			position: relative;
			font-size: 0;
			
			.userAvatarImage{
				width: 64rpx;
				height: 64rpx;
				border-radius: 64rpx;
			}
			
			.userAvatarFrameImage{
				width: 72rpx;
				height: 72rpx;
				position: absolute;
				left: -4rpx;
				top: -4rpx;
			}
			
			.certificate{
				position: absolute;
				right: -4rpx;
				bottom: -4rpx;
				width: 20rpx;
				height: 20rpx;
			}
		}
		
		.userMessage{
			padding-left: 12rpx;
			height: 72rpx;
			
			.userName{
				font-size: 22rpx;
				color: #999;
				height: 36rpx;
				display: flex;
				align-items: center;
				margin-top: 4rpx;
				line-height: 36rpx;
				
				.levelLogo{
					height: 20rpx;
					margin-left: 5px;
				}
			}
			
			.userLabel{
				font-size: 20rpx;
				color: #ddd;
				height: 28rpx;
				line-height: 28rpx;
			}
		}
	}
	
	.reviewsContent{
		padding-left: 72rpx;
		padding-top: 8px;
		
		.postmasterReviewWrap{
			font-size: 26rpx;
			color: #333;
			line-height: 40rpx;
			
			.postmasterReview{
				max-height: 200rpx;
				overflow: hidden;
			}
			
			.openMore{
				font-size: 24rpx;
				color: #71e0fe;
				display: flex;
			}
		}
		
		.otherReview{
			margin-top: 8px;
			background: #f2f4f5;
			border-radius: 8px;
			padding: 24rpx 16rpx;
			
			.otherReviewList{
				font-size: 24rpx;
				color: #333;
				line-height: 36rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				overflow: hidden;
				-webkit-line-clamp: 2;
				
				.otherUserName{
					display: inline-block;
					color: #71e0fe;
				}
				
				.otherUserContent{
					display: inline;
					
				}
			}
			
			.allOtherReviewNum{
				font-size: 24rpx;
				line-height: 36rpx;
				color: #999;
				display: flex;
				
				
			}
		}
		
		.reviewMessage{
			padding: 12px 0;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #f2f4f5;
			font-size: 20rpx;
			color: #b3b3b3;
			
			.reviewMessageRight{
				display: flex;
				justify-content: flex-end;
				
				.reply{
					display: flex;
					align-items: center;
					
					image{
						height: 13px;
						padding-right: 5px;
					}
				}
				
				.praise{
					padding: 0 40rpx;
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>