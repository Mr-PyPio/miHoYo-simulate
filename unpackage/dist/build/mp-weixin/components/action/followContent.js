(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/action/followContent"],{"0969":function(t,e,n){"use strict";n.r(e);var a=n("3431"),o=n.n(a);for(var r in a)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(r);e["default"]=o.a},3431:function(t,e,n){"use strict";(function(t){var a=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=a(n("2eee")),r=a(n("448a")),s=a(n("c973")),i=a(n("9523")),c=n("26cb"),u=n("24b9");function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){(0,i.default)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var d={components:{ItemContent:function(){n.e("components/common/itemContent").then(function(){return resolve(n("9288"))}.bind(null,n)).catch(n.oe)},UserInstantItems2:function(){n.e("components/user/userInstantItems2").then(function(){return resolve(n("8752"))}.bind(null,n)).catch(n.oe)},FollowRecommendActive:function(){n.e("components/action/followRecommendActive").then(function(){return resolve(n("3bb6"))}.bind(null,n)).catch(n.oe)}},data:function(){return{categroyId:0,is_last:!1,loading:!1,next_offset:null,postData:[]}},computed:f(f({},(0,c.mapState)(["actionPage"])),{},{allShow:function(){return this.is_last}}),methods:f(f({},(0,c.mapMutations)(["updateActionPage"])),{},{getPostData:function(t){var e=this;return(0,s.default)(o.default.mark((function n(){var a,r;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,(0,u.getTimelineList)(t);case 2:a=n.sent,r=a.data,r.data&&(e.postData=r.data.list,e.is_last=r.data.is_last,e.next_offset=r.data.next_offset,e.updateActionPage({name:"follow",data:{postData:e.postData,is_last:e.is_last,next_offset:e.next_offset}}));case 5:case"end":return n.stop()}}),n)})))()},loadMoreDate:function(){var t=this;return(0,s.default)(o.default.mark((function e(){var n,a,s;return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.loading){e.next=4;break}return e.abrupt("return");case 4:t.loading=!0;case 5:if(t.is_last){e.next=11;break}return e.next=8,(0,u.getTimelineList)(t.categroyId,t.next_offset);case 8:n=e.sent,a=n.data,a.data&&((s=t.postData).push.apply(s,(0,r.default)(a.data.list)),t.is_last=a.data.is_last,t.next_offset=a.data.next_offset,t.updateActionPage({name:"follow",data:{postData:t.postData,is_last:t.is_last,next_offset:t.next_offset}}),t.loading=!1);case 11:case"end":return e.stop()}}),e)})))()},navigatePostReplay:function(e,n){n?t.$emit("navPage","postReplay",e):t.$emit("navPage","artical",e)},navigateToUser:function(e){t.$emit("navPage","user",e)}}),created:function(){this.actionPage.follow?(this.postData=this.actionPage.follow.postData,this.is_last=this.actionPage.follow.is_last,this.next_offset=this.actionPage.follow.next_offset):this.getPostData(this.categroyId)},filters:{changeMonAndDay:function(t,e){var n=new Date,a=new Date(1e3*parseInt(t)),o=n.getDate(),r=a.getDate(),s="";if("2"===e&&(s="原神"),"1"===e&&(s="崩坏"),"6"===e&&(s="崩坏：星穹铁道"),"3"===e&&(s="崩坏学院2"),"4"===e&&(s="未定事件簿"),"8"===e&&(s="绝区零"),"5"===e&&(s="大别野"),o===r){var i=n.getHours(),c=n.getMinutes(),u=a.getHours(),l=a.getMinutes();return i-u<=1?"".concat(c-l+60,"分钟前 · 在").concat(s,"发布了帖子"):"".concat(i-u,"小时前 · 在").concat(s,"发布了帖子")}r<10&&"0".concat(r),a.getMonth()+1<10?"0".concat(a.getMonth()+1):a.getMonth();var f=n.getFullYear(),d=a.getFullYear();return f===d?"".concat(a.getMonth()+1,"月").concat(r," · 在").concat(s,"发布了帖子"):"".concat(a.getFullYear(),"年").concat(a.getMonth()+1,"月").concat(r," · 在").concat(s,"发布了帖子")}}};e.default=d}).call(this,n("543d")["default"])},"58db":function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return a}));var a={uIcon:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-icon/u-icon")]).then(n.bind(null,"ee35"))}},o=function(){var t=this,e=t.$createElement,n=(t._self._c,t.postData.length),a=n?t.__map(t.postData,(function(e,n){var a=t.__get_orig(e),o=1===e.entity_type?t._f("imageUrlReset")(e.post.user.avatar_url,50,80):null,r=1===e.entity_type&&e.post.user.pendant?t._f("imageUrlReset")(e.post.user.pendant,50,80):null,s=1===e.entity_type?t._f("changeMonAndDay")(e.post.post.created_at,e.game_id):null,i=1===e.entity_type?e.post.topics.length:null,c=2===e.entity_type?t._f("imageUrlReset")(e.instant.user.avatar_url,50,80):null,u=2===e.entity_type&&e.instant.user.pendant?t._f("imageUrlReset")(e.instant.user.pendant,50,80):null,l=2===e.entity_type?t._f("changeMonAndDay")(e.instant.instant.created_at,e.game_id):null;return{$orig:a,f0:o,f1:r,f2:s,g1:i,f3:c,f4:u,f5:l}})):null;t.$mp.data=Object.assign({},{$root:{g0:n,l0:a}})},r=[]},7674:function(t,e,n){"use strict";n.r(e);var a=n("58db"),o=n("0969");for(var r in o)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(r);n("7a5d");var s=n("f0c5"),i=Object(s["a"])(o["default"],a["b"],a["c"],!1,null,"7aa54c74",null,!1,a["a"],void 0);e["default"]=i.exports},"7a5d":function(t,e,n){"use strict";var a=n("8abf"),o=n.n(a);o.a},"8abf":function(t,e,n){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/action/followContent-create-component',
    {
        'components/action/followContent-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("7674"))
        })
    },
    [['components/action/followContent-create-component']]
]);