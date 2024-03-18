(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/common/topPostsList"],{"071e":function(t,n,o){"use strict";o.r(n);var e=o("400a"),u=o.n(e);for(var r in e)["default"].indexOf(r)<0&&function(t){o.d(n,t,(function(){return e[t]}))}(r);n["default"]=u.a},"3c90":function(t,n,o){"use strict";var e=o("7ff1"),u=o.n(e);u.a},"400a":function(t,n,o){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{topPosts:{type:Array,default:function(){return[]}}},filters:{getStatus:function(t){return t.is_top?"置顶":t.is_good?"Good":t.is_official?"Offic":void 0}}};n.default=e},"4e64":function(t,n,o){"use strict";o.r(n);var e=o("fcd4"),u=o("071e");for(var r in u)["default"].indexOf(r)<0&&function(t){o.d(n,t,(function(){return u[t]}))}(r);o("3c90");var i=o("f0c5"),a=Object(i["a"])(u["default"],e["b"],e["c"],!1,null,"8ad2900a",null,!1,e["a"],void 0);n["default"]=a.exports},"7ff1":function(t,n,o){},fcd4:function(t,n,o){"use strict";o.d(n,"b",(function(){return u})),o.d(n,"c",(function(){return r})),o.d(n,"a",(function(){return e}));var e={uTag:function(){return Promise.all([o.e("common/vendor"),o.e("node-modules/uview-ui/components/u-tag/u-tag")]).then(o.bind(null,"87b9"))}},u=function(){var t=this,n=t.$createElement,o=(t._self._c,t.__map(t.topPosts,(function(n,o){var e=t.__get_orig(n),u=o<4?t._f("getStatus")(n.post_status):null;return{$orig:e,f0:u}})));t.$mp.data=Object.assign({},{$root:{l0:o}})},r=[]}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/common/topPostsList-create-component',
    {
        'components/common/topPostsList-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("4e64"))
        })
    },
    [['components/common/topPostsList-create-component']]
]);
