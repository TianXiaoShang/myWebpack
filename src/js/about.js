require('../css/reset.css');
import 'src/html/about.html'
require('../css/animate.min.css');        //两种模块化规范都可以
import '../css/about.styl';
require('../css/swiper.min.css');
require('../js/swiper.min.js');
const $ = require('jquery');


// 鼠标放上跳转APP页面
const lists = $('.people-item')
// 成员轮播图
const memberSlider = new Swiper('.member-Slider', {
    loop: true,
    speed: 1000,
    effect: 'fade',
    controller: {
        control: memberSlider,
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
            $('.people-item').css('border', 'none')
            $(lists[currentIndex - 1]).css('border', '1px solid #5C85FE')
        },
    },
})
$('.people-item').on('mouseenter', (e) => {
    for (let i = 0; i < lists.length; i++) {
        const element = lists[i];
        if (e.currentTarget === element) {
            memberSlider.slideTo(i + 1, 1000, false);
        }
    }
})


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

    scrollnumber(".profile-main", 'animated fadeInUp');
    scrollnumber(".profile-title", 'animated fadeInLeft');

    scrollnumber(".evolution-title", 'animated fadeInLeft');
    scrollnumber(".evolution-main", 'animated fadeInUp');

    scrollnumber(".member-title", 'animated fadeInLeft');
    scrollnumber(".slider-wrap", 'animated fadeInUp');
    scrollnumber(".member-list", 'animated fadeInUp');
}

$(document).ready(function (e) {
    scrollfun();
    $(window).scroll(function () {
        scrollfun();
    });
});
