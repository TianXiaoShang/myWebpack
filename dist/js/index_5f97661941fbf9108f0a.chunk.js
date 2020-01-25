(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 17:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_array_reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var core_js_modules_es6_array_reduce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_reduce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony import */ var core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_for_each__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_myStylus_styl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39);
/* harmony import */ var _css_myStylus_styl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_myStylus_styl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);



__webpack_require__(38); //两种模块化规范都可以


 //两种模块化规范都可以

 //特别实用的一个库，npm i lodash --save
// import "@babel/polyfill"         //配合babel-lader进行一些高级语法转低级语法的弥补(一些低版本浏览器不存在的特性),而事实上我们配置了"useBuiltIns": "usage" 后会自动引入到业务代码，业务代码中我们不用手动引入！

var $ = __webpack_require__(42);

$('.tab-item').on('click', function (e) {
  $('.tab-item').removeClass('tab-item-actve');
  $(e.currentTarget).addClass('tab-item-actve');
  var type = e.target.getAttribute('type');
  myScrollTo(type, 500);
});

function myScrollTo(type) {
  var myIndex;
  var heights = [];
  [].slice.call($('.card-aline')).forEach(function (ele, index) {
    if (ele.id == type) {
      myIndex = index;
    }

    heights.push($(ele).height());
  });
  window.allHeight = heights.reduce(function (a, b) {
    return a + b;
  }); //滚动内容总高，用于计算可滚动高度

  var arr = heights.slice(0, myIndex);
  var y;
  y = arr.length != 0 ? arr.reduce(function (a, b) {
    return a + b;
  }) : 0;
  scrollStart(y);
}

window.timer = '';

function scrollStart(y) {
  clearInterval(timer);
  var isHeight = $('.scroll-wrap').height();
  var k = allHeight - isHeight; //最高滚动距离，总高度减去盒子高度
  // var child = [].slice.call($('.card-aline'))
  // var lastChild = child[child.length -1]
  // var lastChildheight = $(lastChild).height()
  // var k = isHeight - lastChildheight

  var el = document.getElementsByClassName('scroll-wrap')[0];
  var currentPosition = el.scrollTop;
  timer = setInterval(function () {
    var el = document.getElementsByClassName('scroll-wrap')[0];
    var currentPosition = el.scrollTop;
    var curPos;

    if (Math.abs(currentPosition - y) < 7) {
      clearInterval(timer);
      $('.scroll-wrap').scrollTop(y);
      console.log('滚完了');
    } else {
      curPos = currentPosition > y ? currentPosition - 7 : currentPosition + 7;

      if (curPos > k) {
        //如果大于最大可滚动高度
        clearInterval(timer);
        console.log('超过滚动高度，老子不滚啦！');
        $('.scroll-wrap').scrollTop(k);
      } else {
        $('.scroll-wrap').scrollTop(curPos);
      }
    }
  }, 1);
}

console.log(1);
console.log(lodash__WEBPACK_IMPORTED_MODULE_3___default.a.join(['a', 'b', 'c'], '***'));

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

},[[17,1,2]]]);
//# sourceMappingURL=index_5f97661941fbf9108f0a.chunk.js.map