(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/index/hardcore"],{"0099":function(t,e,n){"use strict";n.r(e);var o=n("9443"),s=n.n(o);for(var a in o)["default"].indexOf(a)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(a);e["default"]=s.a},"1b14":function(t,e,n){},"1b1c":function(t,e,n){"use strict";n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return o}));var o={uIcon:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-icon/u-icon")]).then(n.bind(null,"ee35"))},uLoadingPage:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-loading-page/u-loading-page")]).then(n.bind(null,"0829"))}},s=function(){var t=this,e=t.$createElement,n=(t._self._c,t.pageLoading?null:t.postsListData.length),o=!t.pageLoading&&n?t.__map(t.postsListData,(function(e,n){var o=t.__get_orig(e),s=4===n?t.hotTopics.length:null,a=4===n&&s>0?t.__map(t.hotTopics,(function(e,n){var o=t.__get_orig(e),s=n<4?t._f("imageUrlReset")(e.cover,100,80):null;return{$orig:o,f0:s}})):null;return{$orig:o,g1:s,l0:a}})):null;t.$mp.data=Object.assign({},{$root:{g0:n,l1:o}})},a=[]},"392b":function(t,e,n){"use strict";n.r(e);var o=n("1b1c"),s=n("0099");for(var a in s)["default"].indexOf(a)<0&&function(t){n.d(e,t,(function(){return s[t]}))}(a);n("f7c1");var r=n("f0c5"),i=Object(r["a"])(s["default"],o["b"],o["c"],!1,null,"f1e7f6f0",null,!1,o["a"],void 0);e["default"]=i.exports},9443:function(t,e,n){"use strict";(function(t){var o=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s=o(n("2eee")),a=o(n("448a")),r=o(n("c973")),i=n("24b9"),l={name:"hardcore",components:{TopPostsList:function(){n.e("components/common/topPostsList").then(function(){return resolve(n("4e64"))}.bind(null,n)).catch(n.oe)},PostItems:function(){n.e("components/common/postItems").then(function(){return resolve(n("8533"))}.bind(null,n)).catch(n.oe)}},data:function(){return{topPosts:[],hotTopics:[],sortConfig:[],sort:{show_sort:1,name:"最新回复",page:1,is_hot:!1,sort_type:1},scrollMessage:{refresherTrg:!1,refresherAble:!0,scrollY:!0,loadingEnd:!1},last_id:null,postsListData:[],pageLoading:!0}},methods:{getForumMain:function(){var t=this;return(0,r.default)(s.default.mark((function e(){var n,o;return s.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,(0,i.hardCoreMainApi)();case 2:n=e.sent,o=n.data,t.topPosts=o.data.top_posts,t.sortConfig=o.data.forum_sort_config,t.hotTopics=o.data.topics;case 7:case"end":return e.stop()}}),e)})))()},getForumPostList:function(){var t=arguments,e=this;return(0,r.default)(s.default.mark((function n(){var o,r,l,u,c,d,f,g,p,h,m,v;return s.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(o=t.length>0&&void 0!==t[0]?t[0]:1,r=t.length>1&&void 0!==t[1]?t[1]:20,l=t.length>2&&void 0!==t[2]?t[2]:1,u=t.length>3&&void 0!==t[3]&&t[3],c=t.length>4&&void 0!==t[4]?t[4]:0,d=t.length>5?t[5]:void 0,f=[],e.scrollMessage.loadingEnd=!0,!(o>1&&e.last_id)){n.next=17;break}return n.next=11,(0,i.hardCorePostList)(o,r,l,u,e.last_id);case 11:g=n.sent,p=g.data,f=p.data.list,e.last_id=p.data.last_id,n.next=23;break;case 17:return n.next=19,(0,i.hardCorePostList)(o,r,l,u);case 19:h=n.sent,m=h.data,f=m.data.list,e.last_id=m.data.last_id;case 23:1===c?(v=e.postsListData).push.apply(v,(0,a.default)(f)):(e.postsListData=f,e.pageLoading&&(e.pageLoading=!1)),d&&d(),e.sort.page+=1,e.scrollMessage.loadingEnd=!1;case 27:case"end":return n.stop()}}),n)})))()},openSortSelect:function(e){var n=e.detail.y;t.$emit("openWrap",this.sortConfig,15,n,"H")},scroll:function(t){},scrollBottom:function(){this.scrollMessage.loadingEnd||this.getForumPostList(this.sort.page,20,this.sort.sort_type,this.sort.is_hot,1)},scrollPull:function(t){var e=this;t.detail.deltaY<0||this.scrollMessage.loadingEnd||(this.scrollMessage.loadingEnd=!0,this.scrollMessage.refresherTrg=!0,this.getForumPostList(1,20,this.sort.sort_type,this.sort.is_hot,0,(function(){e.scrollMessage.refresherTrg=!1,e.scrollMessage.loadingEnd=!1})))}},created:function(){this.getForumMain(),this.getForumPostList()}};e.default=l}).call(this,n("543d")["default"])},f7c1:function(t,e,n){"use strict";var o=n("1b14"),s=n.n(o);s.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/index/hardcore-create-component',
    {
        'components/index/hardcore-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("392b"))
        })
    },
    [['components/index/hardcore-create-component']]
]);
