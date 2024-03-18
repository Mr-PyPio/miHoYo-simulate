<template>
	<view class="cardGroup">
		<ModuleTitle :moduleTitle="moduleTitle"></ModuleTitle>
		<tab-swiper-one :swiperData="newData"  :tabList="tabList"></tab-swiper-one>
	</view>
</template>

<script>
	import ModuleTitle from './moduleTitle.vue'
	import TabSwiperOne from '../common/tabSwiperOne.vue'
	export default {
		name:"cardGroup",
		components: {
			TabSwiperOne,
			ModuleTitle
		},
		props: {
			cardGroupData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				tabList: [],
				newData: [],
				moduleTitle: {
					src: '../../static/survey/card.png',
					url: '',
					name: '卡组攻略'
				},
			};
		},
		methods: {
			resetData(data) {
				for(let i = 0; i < data.length; i++) {
					const list = data[i].list
					let tabListObj = {}
					for(let j = 0; j < list.length; j ++) {
						if(Object.prototype.toString.call(list[j].ext) != '[object Object]') {
							const json = JSON.parse(list[j].ext)
							const objKey = Object.keys(json)
							const objData = json[objKey[0]]
							let arr = []
							let filter
							for(let pop in objData) {
								if(objData[pop].list) {
									arr.push(objData[pop].list[0])
								}else if(objData[pop].text) {
									const text = JSON.parse(objData[pop].text)
									let obj = {}
									for(let i = 0; i < text.length; i ++) {
										const splitArr = text[i].split('/')
										obj[splitArr[0]] = splitArr[1]
										if(tabListObj[splitArr[0]]) {
											if( !tabListObj[splitArr[0]].includes(splitArr[1])) {
												tabListObj[splitArr[0]].push(splitArr[1])
											}
										}else{
											tabListObj[splitArr[0]] = [splitArr[1]]
										}
									}
									filter = obj
								}
							}
							list[j].ext = {
								list: arr,
								filter,
							}
						}
					}
					this.tabList.push(tabListObj)
					data[i].list = list
				}
				this.newData = data
			}
		},
		created() {
			this.resetData(this.cardGroupData.children)
		},
	}
</script>

<style lang="scss" scoped>
.cardGroup{
	padding: 20rpx 32rpx 0;
}
</style>