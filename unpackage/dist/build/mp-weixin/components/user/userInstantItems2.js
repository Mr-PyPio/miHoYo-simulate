(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/user/userInstantItems2"],{3339:function(t,e,n){"use strict";var a=n("7b6f"),o=n.n(a);o.a},"46fb":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){}));var a=function(){var t=this.$createElement,e=(this._self._c,this._f("imageUrlReset")(this.item.user.avatar_url,50,80)),n=this.item.topic_list.length;this.$mp.data=Object.assign({},{$root:{f0:e,g0:n}})},o=[]},"7b6f":function(t,e,n){},8752:function(t,e,n){"use strict";n.r(e);var a=n("46fb"),o=n("c1ea");for(var r in o)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(r);n("3339");var c=n("f0c5"),i=Object(c["a"])(o["default"],a["b"],a["c"],!1,null,"b5266816",null,!1,a["a"],void 0);e["default"]=i.exports},c1ea:function(t,e,n){"use strict";n.r(e);var a=n("c852"),o=n.n(a);for(var r in a)["default"].indexOf(r)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(r);e["default"]=o.a},c852:function(t,e,n){"use strict";(function(t){var a=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=a(n("2eee")),r=a(n("c973")),c=n("24b9"),i={components:{ItemContent:function(){n.e("components/common/itemContent").then(function(){return resolve(n("9288"))}.bind(null,n)).catch(n.oe)}},props:{item:{type:Object,default:function(){return{}}}},data:function(){return{is_following:this.item.user.is_following}},methods:{navigateToUser:function(e){t.$emit("navPage","user",e)},navigatePostReplay:function(e,n){n?t.$emit("navPage","postReplay",e):t.$emit("navPage","artical",e)},followUser:function(t){var e=this;return(0,r.default)(o.default.mark((function n(){var a,r,i,s;return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(e.is_following){n.next=8;break}return n.next=3,(0,c.follow)({entity_id:t});case 3:a=n.sent,r=a.data,"OK"===r.message&&(e.is_following=!0),n.next=13;break;case 8:return n.next=10,(0,c.unfollow)({entity_id:t});case 10:i=n.sent,s=i.data,"OK"===s.message&&(e.is_following=!1);case 13:case"end":return n.stop()}}),n)})))()}},computed:{userLabel:function(){var t="";switch(this.item.game_id){case 2:t="原神";break;case 1:t="原神";break;case 3:t="原神";break;case 4:t="原神";break;case 5:t="原神";break;case 6:t="原神";break}return"在".concat(t,"的帖子")},followText:function(){return this.is_following?"已关注":"+ 关注"}},filters:{changeMonAndDay:function(t){var e=new Date,n=new Date(1e3*parseInt(t)),a=e.getDate(),o=n.getDate();if(a===o){var r=e.getHours(),c=e.getMinutes(),i=n.getHours(),s=n.getMinutes();return r==i?"".concat(c-s,"分钟前 · 原神"):"".concat(r-i,"小时前 · 原神")}o<10&&"0".concat(o),n.getMonth()+1<10?"0".concat(n.getMonth()+1):n.getMonth();var u=e.getFullYear(),f=n.getFullYear();return u===f?"".concat(n.getMonth()+1,"月").concat(o," · 原神"):"".concat(n.getFullYear(),"年").concat(n.getMonth()+1,"月").concat(o," · 原神")}}};e.default=i}).call(this,n("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/user/userInstantItems2-create-component',
    {
        'components/user/userInstantItems2-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("8752"))
        })
    },
    [['components/user/userInstantItems2-create-component']]
]);
