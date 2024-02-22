
const baseUrl = 'http://192.168.0.104:8086/api/'


const apiRequest =(url,data = {},type = 'get') => {
	return new Promise((resolve,reject) => {
		uni.request({
			url: `${baseUrl}${url}`,
			method: type,
			data: data,
			success: res => {
				if(res.statusCode == 200) {
					resolve(res)
				}else{
					reject(res)
				}
			},
		})
	})
}


exports.getHomeNew = (parts,version = 3) => {
	return apiRequest('getHomeNew',{
		gids: 2,
		version,
		parts
	})
}

exports.getFindDiscover = (filter) => {
	return apiRequest('getIndexDiscover',{
		filter,
		gids: 2,
		version: 3,
		fresh_action: 1,
		is_first_initialize: true
	})
}

exports.tavernHotTopicsApi = () => {
	return apiRequest('getForumMain',{
		forum_id: 26
	})
}

exports.tavernPostListApi = (page,page_size,sort_type) => {
	return apiRequest('getForumPostList',{
		page,
		page_size,
		sort_type,
		is_hot : true,
		forum_id : 26
	})
}

exports.strategyTopTabApi = () => {
	return apiRequest('getStrategyTopTab')
}

exports.strategyTopPostApi = () => {
	return apiRequest('getForumMain',{
		forum_id: 43
	})
}

exports.strategyPostList = (page,page_size,sort_type) => {
	return apiRequest('getStrategyPostList',{
		page,
		page_size,
		sort_type
	})
}

exports.surveyBannerApi = () => {
	return apiRequest('getSurveyBanner')
}

exports.surveyMapApi = () => {
	return apiRequest('getSurveyMap')
}

exports.fanArtTopNApi = () => {
	return apiRequest('getForumCatePostTopN',{
		forum_id : 29
	})
}
exports.fanArtMainApi = () => {
	return apiRequest('getForumMain',{
		forum_id : 29
	})
}
exports.fanArtPostList = (page,page_size,sort_type,is_hot,last_id) => {
	let data
	if(last_id){
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			last_id,
			forum_id : 29
		}
	}else{
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			forum_id : 29
		}
	}
	return apiRequest('getForumPostList',data)
}

exports.cosTopNApi = () => {
	return apiRequest('getImagePostTopN',{
		gids: 2,
		forum_id : 49
	})
}

exports.cosMainApi = () => {
	return apiRequest('getForumMain',{
		forum_id : 49
	})
}
exports.cosPostList = (page,page_size,sort_type,is_hot,last_id) => {
	let data
	if(last_id){
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			last_id,
			forum_id : 49
		}
	}else{
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			forum_id : 49
		}
	}
	return apiRequest('getForumPostList',data)
}

exports.hardCoreMainApi = () => {
	return apiRequest('getForumMain',{
		forum_id : 50
	})
}
exports.hardCorePostList = (page,page_size,sort_type,is_hot,last_id) => {
	let data
	if(last_id){
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			last_id,
			forum_id : 50
		}
	}else{
		data = {
			page,
			page_size,
			sort_type,
			is_hot,
			forum_id : 50
		}
	}
	return apiRequest('getForumPostList',data)
}

exports.postReplaiesApi = (post_id,is_hot,order_type = 0,last_id = 0,only_master,size,from_external_link) => {
	let data
	if(last_id) {
		data = {
			post_id,
			last_id,
			order_type,
			is_hot,
			only_master,
			size:20,
			from_external_link: false,
		}
	}else{
		data = {
			post_id,
			order_type,
			is_hot,
			size:20,
			only_master,
			from_external_link: false,
		}
	}
	return apiRequest('getPostReplaies',data)
}

exports.foldedPostRepliesApi = (post_id,is_hot,order_type = 0,size,only_master) => {
	const data = {
		post_id,
		order_type,
		is_hot,
		size:20,
		only_master: false,
	}
	return apiRequest('getFoldedPostReplies',data)
}

exports.postFullApi = (post_id) => {
	return apiRequest('getPostFull',{
		post_id
	})
}

exports.emotionApi = () => {
	return apiRequest('getEmotion')
}

exports.emotionKeywordsApi = () => {
	return apiRequest('getEmotionKeywords')
}

exports.upvoteApi = (data) => {
	return apiRequest('upvote',{
		data
	},'post')
}


//用户关注
exports.follow = (data) => {
	return apiRequest('follow',{
		data
	},'post')
}

exports.unfollow = (data) => {
	return apiRequest('unfollow',{
		data
	},'post')
}

exports.collectPost = (data) => {
	return apiRequest('collectPost',{
		data
	},'post')
}

exports.searchNew = () => {
	return apiRequest('getHomeNew',{
		gids: 2,
		version: 3,
		parts: 5
	})
}

exports.getSiteHotKeyword = () => {
	return apiRequest('getSiteHotKeyword',{
		gids: 2,
	})
}

exports.searchPreKeyword = () => {
	return apiRequest('searchPreKeyword',{
		gids: 2,
	})
}

exports.predictUGC = (word) => {
	return apiRequest('predictUGC',{
		gids: 2,
		word
	})
}


exports.search = (keyword,order_type = 1,size = 20) => {
	return apiRequest('search',{
		gids: 2,
		order_type,
		size,
		keyword
	})
}

exports.searchPost = (keyword,search_type = 0,last_id = 0,size = 20,order_type = 1) => {
	return apiRequest('searchPost',{
		gids: 2,
		order_type,
		size,
		keyword,
		search_type,
		last_id
	})
}

exports.searchAllWiki = (keyword,last_id = 0,order_type = 1,size = 20) => {
	return apiRequest('searchAllWiki',{
		gids: 2,
		order_type,
		size,
		keyword,
		last_id
	})
}

exports.searchUser = (keyword,last_id = 0,order_type = 1,size = 20) => {
	return apiRequest('searchUser',{
		gids: 2,
		order_type,
		size,
		keyword,
		last_id
	})
}

exports.searchTopic = (keyword,last_id = 0,order_type = 1,size = 20) => {
	return apiRequest('searchTopic',{
		gids: 2,
		order_type,
		size,
		keyword,
		last_id
	})
}

exports.relatedKey = (keyword) => {
	return apiRequest('relatedKey',{
		gids: 2,
		keyword
	})
}

//话题关注
exports.focus = (data) => {
	return apiRequest('focus',{
		data
	},'post')
}

exports.unfocus = (data) => {
	return apiRequest('unfocus',{
		data
	},'post')
}

exports.getNewsList = (type,last_id = 0,page_size = 20,is_official_tab = true) => {
	return apiRequest('getNewsList',{
		gids: 2,
		is_official_tab,
		page_size,
		type,
		last_id
	})
}


exports.getUserFullInfo = (uid) => {
	return apiRequest('getUserFullInfo',{
		uid
	})
}

exports.getGameRecordCard = (uid) => {
	return apiRequest('getGameRecordCard',{
		uid
	})
}
exports.getUserInstantList = (uid,size=20) => {
	return apiRequest('getUserInstantList',{
		uid,
		size
	})
}
exports.getUserFavourite = (uid,size=20) => {
	return apiRequest('getUserFavourite',{
		uid,
		size
	})
}

exports.getUserReply = (uid,size=20) => {
	return apiRequest('getUserReply',{
		uid,
		size
	})
}
exports.getUserCollection = (uid,size=20) => {
	return apiRequest('getUserCollection',{
		uid,
		size
	})
}
