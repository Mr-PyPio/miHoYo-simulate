(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/common/recommendVideoItems"],{"26cb2":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={props:{itemData:{type:Object,default:function(){return{}}},loading:{type:Boolean,default:function(){return!1}}},filters:{getTime:function(t){if(t>0){var e=(new Date).getFullYear(),n=new Date(1e3*parseInt(t)),a=n.getFullYear(),c=n.getDate()<10?"0".concat(n.getDate()):n.getDate(),o=n.getMonth()+1<10?"0".concat(n.getMonth()+1):n.getMonth()+1,r=n.getHours()<10?"0".concat(n.getHours()):n.getHours(),u=n.getMinutes()<10?"0".concat(n.getMinutes()):n.getMinutes();return a===e?"".concat(o,"-").concat(c," ").concat(r,":").concat(u):"".concat(a,"-").concat(o,"-").concat(c)}return""}}};e.default=a},8637:function(t,e,n){"use strict";n.r(e);var a=n("e550"),c=n("e0b4");for(var o in c)["default"].indexOf(o)<0&&function(t){n.d(e,t,(function(){return c[t]}))}(o);n("f05d");var r=n("f0c5"),u=Object(r["a"])(c["default"],a["b"],a["c"],!1,null,"1c595a5c",null,!1,a["a"],void 0);e["default"]=u.exports},bb3b:function(t,e,n){},e0b4:function(t,e,n){"use strict";n.r(e);var a=n("26cb2"),c=n.n(a);for(var o in a)["default"].indexOf(o)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=c.a},e550:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return c})),n.d(e,"a",(function(){}));var a=function(){var t=this,e=t.$createElement,n=(t._self._c,t.__map(t.itemData.list,(function(e,n){var a=t.__get_orig(e),c=n<4&&t.loading?t._f("imageUrlReset")(e.icon,120,80):null,o=n<4&&e.avatar_url&&t.loading?t._f("imageUrlReset")(e.avatar_url,30,80):null,r=n<4&&e.article_time?t._f("getTime")(e.article_time):null;return{$orig:a,f0:c,f1:o,f2:r}})));t.$mp.data=Object.assign({},{$root:{l0:n}})},c=[]},f05d:function(t,e,n){"use strict";var a=n("bb3b"),c=n.n(a);c.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/common/recommendVideoItems-create-component',
    {
        'components/common/recommendVideoItems-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("8637"))
        })
    },
    [['components/common/recommendVideoItems-create-component']]
]);