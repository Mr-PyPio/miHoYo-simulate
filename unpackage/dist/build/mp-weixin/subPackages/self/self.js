(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["subPackages/self/self"],{"02fb":function(e,t,n){},"4b25":function(e,t,n){"use strict";n.r(t);var r=n("6e8b"),o=n("e8cb");for(var a in o)["default"].indexOf(a)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(a);n("9bad");var u=n("f0c5"),c=Object(u["a"])(o["default"],r["b"],r["c"],!1,null,"394d2d64",null,!1,r["a"],void 0);t["default"]=c.exports},"6e8b":function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){return r}));var r={uIcon:function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/uview-ui/components/u-icon/u-icon")]).then(n.bind(null,"ee35"))}},o=function(){var e=this,t=e.$createElement,n=(e._self._c,e.userInfo&&e.fixedTopLogoShow?e._f("imageUrlReset")(e.userInfo.avatar_url,200,80):null),r=e.userInfo?e._f("imageUrlReset")(e.userInfo.avatar_url,200,80):null,o=e.gameCard?e.__map(e.gameCard,(function(t,n){var r=e.__get_orig(t),o=e.fittlerImageSrc(t.game_id);return{$orig:r,m0:o}})):null;e.$mp.data=Object.assign({},{$root:{f0:n,f1:r,l0:o}})},a=[]},"9bad":function(e,t,n){"use strict";var r=n("02fb"),o=n.n(r);o.a},adae:function(e,t,n){"use strict";(function(e,t){var r=n("4ea4");n("811e");r(n("66fd"));var o=r(n("4b25"));e.__webpack_require_UNI_MP_PLUGIN__=n,t(o.default)}).call(this,n("bc2e")["default"],n("543d")["createPage"])},b891:function(e,t,n){"use strict";var r=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(n("2eee")),a=r(n("c973")),u=r(n("9523")),c=n("26cb"),s=n("24b9");function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){(0,u.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var l={components:{UserAbout:function(){n.e("components/user/userAbout").then(function(){return resolve(n("5c2c"))}.bind(null,n)).catch(n.oe)},UserPopup:function(){n.e("components/user/userPopup").then(function(){return resolve(n("1c92"))}.bind(null,n)).catch(n.oe)},ImgPopUp:function(){n.e("components/common/imgPopUp").then(function(){return resolve(n("694c"))}.bind(null,n)).catch(n.oe)},ListenOtherModul:function(){n.e("components/index/listenOtherModul").then(function(){return resolve(n("3ebf"))}.bind(null,n)).catch(n.oe)}},data:function(){return{gameCard:null,uid:"19084220",userInfo:null,fixedTopBgColor:"rgba(0, 0, 0, 0.0)",fixedTopLogoShow:!1}},computed:f({},(0,c.mapState)(["myselfData"])),methods:f(f({},(0,c.mapMutations)(["updateMyselfData"])),{},{getUserInfo:function(){var e=this;return(0,a.default)(o.default.mark((function t(){var n,r;return o.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,(0,s.getUserFullInfo)(e.uid);case 2:n=t.sent,r=n.data,e.userInfo=r.data.user_info,e.updateMyselfData({name:"userInfo",data:e.userInfo});case 6:case"end":return t.stop()}}),t)})))()},getGameCard:function(){var e=this;return(0,a.default)(o.default.mark((function t(){var n,r;return o.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,(0,s.getGameRecordCard)(e.uid);case 2:n=t.sent,r=n.data,e.gameCard=r.data.list,e.updateMyselfData({name:"gameCard",data:e.gameCard});case 6:case"end":return t.stop()}}),t)})))()},fittlerImageSrc:function(e){return 2===e?"../../static/user/ys.png":1===e?"../../static/user/bh3.png":6===e?"../../static/user/sr.png":3===e?"../../static/user/bh2.png":4===e?"../../static/user/wd.png":8===e?"../../static/user/zzz.png":void 0},openMeun:function(){this.$nextTick((function(){this.$refs.userPopup.show=!0}))}}),onLoad:function(){this.myselfData.userInfo?this.userInfo=this.myselfData.userInfo:this.getUserInfo(),this.myselfData.gameCard?this.gameCard=this.myselfData.gameCard:this.getGameCard()},onPageScroll:function(e){var t=e.scrollTop;t>200?(this.fixedTopBgColor="#004887",this.fixedTopLogoShow=!0):(this.fixedTopBgColor="rgba(0, 0, 0, 0.0)",this.fixedTopLogoShow=!1)}};t.default=l},e8cb:function(e,t,n){"use strict";n.r(t);var r=n("b891"),o=n.n(r);for(var a in r)["default"].indexOf(a)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=o.a}},[["adae","common/runtime","common/vendor"]]]);