require('../css/animate.min.css');        //两种模块化规范都可以
require('../font/iconfont.js');
require('../css/reset.css');
require('../css/swiper.min.css');
require('../js/swiper.min.js');
import 'src/html/index.html'
import '../css/index.styl';
import '../css/common.styl';
import _ from 'lodash'              //特别实用的一个库，npm i lodash --save
const $ = require('jquery');

function scrollnumber(element, cssName, offset = 80) {
    var a, b, c, d;
    d = $(element).offset().top;
    a = d + offset;
    b = $(window).scrollTop();
    c = $(window).height();
    if (b + c > a) {
        $(element).removeClass('animatEl');
        $(element).addClass(cssName);
    }
}

// 滚动监听执行动画
function scrollfun() {
    scrollnumber(".poster-people", 'animated fadeInUp');
    scrollnumber(".poster-info", 'animated lightSpeedIn');

    scrollnumber(".app-main", 'animated fadeInUp');
    scrollnumber(".app-title", 'animated fadeInLeft');

    scrollnumber(".finance-title", 'animated fadeInLeft');
    scrollnumber(".finance-main", 'animated fadeInUp');
    scrollnumber(".miniApp-main", 'animated fadeInUp');

    scrollnumber(".information-title", 'animated fadeInLeft');
    scrollnumber(".information-img", 'animated fadeInUp');
    scrollnumber(".information-skill-list-wrap", 'animated fadeInUp');

    scrollnumber(".logistics-title", 'animated fadeInLeft');
    scrollnumber(".shopMiniApp-main", 'animated fadeInUp');
    scrollnumber(".logisticsSystem-main", 'animated fadeInUp');

    scrollnumber(".teaching-title", 'animated fadeInLeft');
    scrollnumber(".teaching-img", 'animated fadeInUp');
    scrollnumber(".teaching-skill-list-wrap", 'animated fadeInUp');
}

$(document).ready(function (e) {
    scrollfun();
    $(window).scroll(function () {
        scrollfun();
    });
});
// app轮播图
const lists = $('.app-page-item')
const appSlider = new Swiper('.appSlider', {
    loop: true,
    speed: 1000,
    effect: 'fade',
    controller: {
        control: appSlider,
        inverse: true,
        by: 'slide',
    },
    autoplay: {
        disableOnInteraction: false,
    },
    on: {
        slideChange: function () {
            let currentIndex = this.activeIndex;
            if (this.activeIndex > lists.length) {
                currentIndex = 1
            } else if (this.activeIndex <= 0) {
                currentIndex = lists.length
            }
            $('.app-page-item').removeClass('active')
            $(lists[currentIndex - 1]).addClass('active')
        },
    },
})

// 鼠标放上跳转APP页面
$('.app-page-item').on('mouseenter', (e) => {
    for (let i = 0; i < lists.length; i++) {
        const element = lists[i];
        if (e.currentTarget === element) {
            appSlider.slideTo(i + 1, 1000, false);
        }
    }
})

// 小程序轮播图（2个）
var mySwiper1 = new Swiper('.sliderShowMax', {
    // direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    // preventClicks:true,
    controller: {
        control: mySwiper1,
        inverse: true,
        by: 'slide',
    },
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
        //   type : 'progressbar'
    },
    autoplay: {
        disableOnInteraction: false,
    },
})


// 教学管理轮播图
var informationSlider = new Swiper('.informationSlider', {
    // direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    // preventClicks:true,
    controller: {
        control: informationSlider,
        inverse: true,
        by: 'slide',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
})
//鼠标覆盖停止自动切换
informationSlider.el.onmouseover = function () {
    informationSlider.autoplay.stop();
}
//鼠标离开开始自动切换
informationSlider.el.onmouseout = function () {
    informationSlider.autoplay.start();
}
