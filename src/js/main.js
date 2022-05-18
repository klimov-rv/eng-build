import './vendor';
import helpers from './helpers';
import './components/social';
import arrLang from './components/langs';
import { ieFix } from './vendor/ie-fix';
import { vhFix } from './vendor/vh-fix';
import { actualYear } from './modules/actualYear';
import header from './components/header';
import lazyLoading from './modules/lazyLoading';

import Typed from "typed.js";
import inView from "in-view";
import Swiper from "swiper";
import SwiperCore, { Navigation, Pagination, Autoplay, EffectFade, EffectCube, Mousewheel, Lazy, Controller } from 'swiper/core';
import { Fancybox, Carousel, Panzoom } from "@fancyapps/ui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import SplitText from './modules/splitText';
import MmenuLight from "mmenu-light";
import AOS from "aos";
import Inputmask from "inputmask";
import { each } from 'jquery';

ieFix();
vhFix();
actualYear();

header.init();
lazyLoading.init();


SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade, EffectCube, Mousewheel, Lazy, Controller]);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let resolution_s = "320x182";
let resolution_lg = "586x330";
let resolution_wide = "990x560";

var intViewportHeight = window.innerHeight;
var intViewportWidth = window.innerWidth;

var prohodDone = false;

// function checkValidnost(input) {
//     if (input.name == "check") {
//         if (document.forms["feedback"][input.name].checked) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         if (document.forms["feedback"][input.name].value != "") {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }
// var verifyCallback = function(response) {
//     if (response.length == 0) {
//         console.log("reCaptcha not verified");
//         console.log(response);
//         return false;
//     } else {
//         var inputsR = document.querySelectorAll(".js-input-require");

//         inputsR.forEach(input => {
//             input.oninput = function() {
//                 if (checkValidnost(inptName) && checkValidnost(inptEmail) && checkValidnost(inptCheck)) {
//                     document.querySelector(".feedback-form-btn").classList.add("btn-active");
//                 } else {
//                     document.querySelector(".feedback-form-btn").classList.remove("btn-active");
//                 }
//             };
//         })
//     }
// } 

async function InsertCorrectVideo(videoOptions, resolution, curr_lang) {
    var videos = document.getElementsByTagName("video")
    var videosList = Array.prototype.slice.call(videos);
    var promises = [];
    var responsePromises = [];

    videosList.forEach((value) => {
        videoOptions.forEach((id) => {

            let model = id[1][0];
            let video_name = id[1][1];
            if (value.id == `index-${id[0]}`) {
                let video = document.getElementById(value.id);
                let vidSource = document.createElement('source');
                if (video.canPlayType('video/mp4').length > 0) {
                    var typeVid = 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"';
                    var pathToVid = `video/${curr_lang}/${model}/${resolution}/${video_name}.mp4`;
                } else if (video.canPlayType('video/webm').length > 0) {
                    var typeVid = 'video/webm';
                    var pathToVid = `video/${curr_lang}/${resolution}/webm/${video_name}.webm`;
                } else {
                    var pathToVid = "";
                }
                if (video.getElementsByTagName('source').length > 0) {
                    var sourceEl = video.getElementsByTagName("source"),
                        index;
                    for (index = sourceEl.length - 1; index >= 0; index--) {
                        sourceEl[index].parentNode.removeChild(sourceEl[index]);
                    };
                }
                vidSource.setAttribute('data-src', pathToVid);
                vidSource.setAttribute('type', typeVid);

                video.appendChild(vidSource);
                promises.push(video);
            }
        });
    });
    responsePromises = await Promise.all(promises).then(() => {
        console.log('The Promise.all fulfilled for videos');
        for (let index = 0; index < promises.length; index++) {
            console.log(promises[index].id)
        }
    }).catch(error => {
        console.log('The Promise.all rejected');
        console.log(error);
        // console.log('Use the Play button instead.');
        // var playButton = document.querySelector('#play');
    });
}

async function asyncPlay(video) {
    video.currentTime = 0;
    const play = await video.play().catch((e) => {
        return new Error("video not play")
    });
    if (play instanceof Error) {
        console.log `Error play video`;
        setTimeout(function() {
            asyncPlay(video);
        }, 1000);
    }
}

function anchorPhotoGallery() {
    var galleryToScrollElHeight = document.querySelector(".slider-gallery").offsetHeight / 2;
    var galleryConst = (intViewportHeight / 2) - galleryToScrollElHeight + 90;
    document.getElementById("gallery").style.top = "-" + galleryConst + "px";
}

function positionArrowsCube() {
    var cubeWrapVideoHeight = document.querySelector(".js-sliderdemo-0").offsetHeight / 2;
    var cubeWrapVideoOffset = document.querySelector(".js-sliderdemo-0").offsetTop;
    // var cubeBtnHeight = document.querySelector(".header-demo__video-btn").offsetHeight / 2;
    // var cubeBtnOffset = document.querySelector(".header-demo__video-btn").offsetTop;
    var cubeProdSection = document.getElementById("prod-section-0");
    var styleProdSection = cubeProdSection.currentStyle || window.getComputedStyle(cubeProdSection);
    styleProdSection = styleProdSection.paddingTop;
    styleProdSection = parseInt(styleProdSection.replace('px', ''), 10);
    if (intViewportWidth > 1024) {
        // для десктопа 
        document.querySelector(".slider-cube-nav").style.top = (cubeWrapVideoHeight + cubeWrapVideoOffset + styleProdSection) + "px";
    } else {
        // для планшета

        // document.querySelector(".slider-cube-nav").style.top = (cubeWrapVideoHeight + cubeWrapVideoOffset + styleProdSection) + "21px";

        // console.log("cubeBtnHeight: " + cubeBtnHeight + " cubeBtnOffset: " + cubeBtnOffset + " styleProdSection: " + styleProdSection);
        // document.querySelector(".slider-cube-nav").style.top = (cubeBtnHeight + cubeBtnOffset + styleProdSection) + "px";
    }
}

function positionArrowsGallery() {
    if (intViewportWidth < 480) {
        var galleryButtonsNext = document.querySelector(".slider-gallery .swiper-button-next");
        var galleryButtonsPrev = document.querySelector(".slider-gallery .swiper-button-prev");
        var gallerySlideElHeight = (document.querySelector(".slider-gallery .swiper-slide picture").offsetHeight / 2) - (galleryButtonsPrev.offsetHeight / 2);
        galleryButtonsNext.style.top = gallerySlideElHeight + "px";
        galleryButtonsPrev.style.top = gallerySlideElHeight + "px";
    }
}

function showHidedSections() {
    if (!$(".site").hasClass("add-sections")) {
        $(".site").addClass("add-sections");
        prohodDone = true;
        anchorPhotoGallery();
        AOS.refresh();
    }
}

function hideHidedSections() {
    if ($(".site").hasClass("add-sections")) {
        $(".site").removeClass("add-sections");
        anchorPhotoGallery();
        AOS.refresh();
    }
}

function smoothBulletsScrollLeft(activeBullet, bulletsWrap, intViewportWidth) {
    var posX = (activeBullet.offsetWidth / 2) + activeBullet.offsetLeft - (intViewportWidth / 2);
    bulletsWrap.scroll({
        left: posX,
        behavior: 'smooth'
    });
}

var isCookie = getCookie("firstVisit");

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}


window.onload = function() {

    var inputsR = document.querySelectorAll(".js-input-require");

    var inptName = document.getElementById("js-input-name");
    var inptEmail = document.getElementById("js-input-email");
    var inptCheck = document.getElementById("js-input-check");


    if (document.getElementById("data-actual-year").length > 0) {
        let work_years = parseInt(document.getElementById("data-actual-year").textContent) - 1988;

        const para1 = document.createElement("p");
        para1.classList.add("work_years");
        const node1 = document.createTextNode(work_years);
        para1.appendChild(node1);
        const element = document.querySelector(".icon-about-1");
        element.appendChild(para1);
    }


    inputsR.forEach(input => {
        input.oninput = function() {
            if (checkValidnost(inptName) && checkValidnost(inptEmail) && checkValidnost(inptCheck)) {
                verify1 = true;
            } else {
                verify1 = false;
            }
            checkValidAndCapcha(verify1, verify2);
        };
    });
    // let curr_lang = "ru";
    // let curr_lang = "en";
    // console.log(curr_lang);

    // порядок подгрузки видео
    var refactorProdMap = [
        ['0_0', ['st01', '1']],
        ['1_0', ['st11', '1']],
        ['2_0', ['st02', '1']],
        ['3_0', ['wmd06_bh06', '1']],
        ['0_1', ['st01', '2']],
        ['0_2', ['st01', '6']],
        ['0_3', ['st01', '4']],
        ['0_4', ['st01', '5']],
        ['0_5', ['st01', '3']],
        ['1_1', ['st11', '2']],
        ['1_2', ['st11', '3']],
        ['1_3', ['st11', '4']],
        ['1_4', ['st11', '5']],
        ['1_5', ['st11', '6']],
        ['2_1', ['st02', '2']],
        ['2_2', ['st02', '5']],
        ['2_3', ['st02', '4']],
        ['2_4', ['st02', '3']],
        ['3_1', ['wmd06_bh06', '2']],
        ['3_2', ['wmd06_bh06', '3']],
        ['3_3', ['wmd06_bh06', '4']],
    ];

    let tl = gsap.timeline();
    if (document.querySelector(".hero").offsetHeight > intViewportHeight) {
        tl.from(".hero", { height: "100vh" })
            .to(".init-loader", { opacity: 0, duration: .7 })
            .from(".nav-container__link", { opacity: 0, stagger: .2 })
            .from(".slider-hero .swiper-pagination", { opacity: 0 })
            .to(".init-loader", { top: "-1000%", duration: .5 })
            .to(".hero", { height: "auto" })
    } else {
        tl.to(".init-loader", { opacity: 0, duration: .7 })
            .from(".nav-container__link", { opacity: 0, stagger: .2 })
            .from(".slider-hero .swiper-pagination", { opacity: 0 })
            .to(".init-loader", { top: "-1000%", duration: .5 })
    }

    let temp_lang = curr_lang;
    if (curr_lang == "sg") {
        // склеиваем sg и en видео/перевод
        temp_lang = "en";
    } else if (curr_lang == "fr") {
        // склеиваем fr и en видео/перевод
        temp_lang = "fr";
    };
    if (intViewportWidth < 480) {
        InsertCorrectVideo(refactorProdMap, resolution_s, temp_lang);
    } else if (intViewportWidth > 480 && intViewportWidth < 2000) {
        InsertCorrectVideo(refactorProdMap, resolution_lg, temp_lang);
    } else if (intViewportWidth > 2000) {
        InsertCorrectVideo(refactorProdMap, resolution_wide, temp_lang);
    }

    AOS.init({
        once: true,
    });

    history.pushState('', document.title, window.location.pathname + window.location.search);


    if (document.getElementsByTagName("body").length > 0) {
        document.getElementsByTagName("body")[0].classList.add("init-body");
        // let promise1 = new Promise(resolve => {
        //     setTimeout(resolve, 2500, 'one');
        // });
        // let promise2 = new Promise(resolve => {
        //     window.addEventListener('scroll', () => {
        //         if (window.pageYOffset > 0) {
        //             resolve;
        //         }
        //     });
        // });

        // Promise.race([promise1, promise2]).then(function(value) {
        //     var sectionToShow = document.getElementById("advantages");
        //     sectionToShow.classList.add('show-to-AOS-animate');
        // }, function(reason) {
        //     console.log(reason);
        // });
    };
    Fancybox.bind("[data-fancybox-plyr]", {
        mainClass: 'fullVid',
        on: {
            done: (fancybox, slide) => {

                var $sliderVideos = $("#prod-section-" + swiperCube.activeIndex + " video");
                $sliderVideos.each(function(index) {
                    this.pause();
                });
            },
            closing: (fancybox, slide) => {
                if (swiperCube.activeIndex == 0) {
                    var currentVideo = swiper3prod0.slides[swiper3prod0.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 1) {
                    var currentVideo = swiper3prod1.slides[swiper3prod1.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 2) {
                    var currentVideo = swiper3prod2.slides[swiper3prod2.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 3) {
                    var currentVideo = swiper3prod3.slides[swiper3prod3.activeIndex].children[0].children[0];
                } else {}

                asyncPlay(currentVideo);
            }
        }
    });
    const type_speed = 35;

    var tOptions8 = {
        strings: ['Скоростной проход ST‑01'],
        typeSpeed: type_speed,
        showCursor: false,
        onComplete: function(self) {
            swiperCube.slides[swiperCube.activeIndex].classList.add("remove-poster");

            inView("#index-" + swiperCube.activeIndex + "_0")
                .once('enter', el => {
                    asyncPlay(document.getElementById("index-" + swiperCube.activeIndex + "_0"));
                })
        }
    };

    inView('#js-dynamic-text-1')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["speed_gates"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
                onComplete: function(self) {
                    el.classList.add("lang");
                }
            });
        })

    inView('#js-dynamic-text-2')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["advantages"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
            });
            positionArrowsCube();
        })

    inView('#js-dynamic-text-3')
        .once('enter', el => {

            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["st-01_speed_gate"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
                onComplete: function() {

                    // клёвый костыль что бы не накладывался inview + typed на подставленный текст при прокрутке из подменю товаров 
                    let dynamicText = document.getElementById("js-dynamic-text-3");
                    let dynamicTextDouble = document.getElementById("js-dynamic-text-3-double");
                    dynamicText.classList.add("hide");
                    dynamicTextDouble.classList.remove("hide");
                }
            });

            swiper2.init();
        })

    inView('#js-dynamic-text-4')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["installation_of_additional"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
            });
            swiperDop.init();
            positionArrowsCube();
        })

    inView('#js-dynamic-text-5')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["gallery"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
            });
            swiper4.init();
            swiper4.on('afterInit', function() {
                // якорь по центру фотогалереи
                anchorPhotoGallery();
            });
            swiper4.autoplay.stop();
        })

    inView('#js-dynamic-text-6')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["about"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
            });
        })

    inView('#js-dynamic-text-7')
        .once('enter', el => {
            el.innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["contact_us"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
            });
        })

    // Скоростной проход ST‑01
    inView('#js-dynamic-prod1')
        .once('enter', el => {
            document.getElementById("js-dynamic-prod1").innerHTML = "";
            new Typed(el, {
                strings: [arrLang[curr_lang]["st-01_speed_gate"]],
                typeSpeed: type_speed,
                showCursor: false,
                onBegin: function(self) {
                    el.parentNode.classList.add("visible");
                },
                onComplete: function(self) {
                    swiperCube.slides[swiperCube.activeIndex].classList.add("remove-poster");

                    console.log("#index-" + swiperCube.activeIndex + "_0");
                    inView("#index-" + swiperCube.activeIndex + "_0")
                        .once('enter', el => {
                            asyncPlay(document.getElementById("index-" + swiperCube.activeIndex + "_0"));
                            console.log("test: start vid index-" + swiperCube.activeIndex + "_0");
                        })
                }
            });
        })

    inView('.slider-gallery')
        .once('enter', el => {
            swiper4.autoplay.start();
            // якорь по центру фотогалереи
            anchorPhotoGallery();
            positionArrowsGallery();
        })

    const ShowScrollToTop = btnScrollTop => {
        var offsetToTrigger = document.getElementById("advantages").offsetTop + 250;
        window.addEventListener('scroll', () => {
            const shouldBeVisible = window.pageYOffset + intViewportHeight > offsetToTrigger;
            btnScrollTop.classList.toggle('visible', shouldBeVisible);

            try {
                history.replaceState(window.location.href.split('#')[0], 'Заголовок', window.location.href.split('#')[0]);
            } catch (z) {
                console.log(z);
            }
            // console.log(window.location.href);
        });
    }
    ShowScrollToTop(document.getElementById('scroll-top'));

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.pageYOffset > 0) {
        var $hash = $(this).attr("href");
        window.scrollTo({
            top: 0,
        });

        window.location.hash = '#';
        window.location.href.replace('#', '');

        $("html, body").animate({
            scrollTop: 0
        }, 0, function() {
            window.location.hash = "";
        });
    }
    if (intViewportHeight < 851) {
        console.log("test height < 851");
        window.dispatchEvent(new Event('resize'));
    } else {
        console.log("test height > 851");
    }

    var swiper2 = new Swiper(".slider-prod", {
        init: false,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
        loop: true,
        pagination: {
            el: ".slider-prod .swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: '.slider-prod .swiper-button-next',
            prevEl: '.slider-prod .swiper-button-prev',
        },
    });

    swiper2.on('slideChangeTransitionEnd', function() {
        let dynamicTextDouble = document.getElementById("js-dynamic-text-3-double");
        let dynamicTextReserve = document.getElementById("js-dynamic-reserve");
        let dynamicSubtext = document.getElementById("js-dynamic-subtext-3");

        let $sliderCharsRefactor = $(".characteristics");

        dynamicTextDouble.innerHTML = this.slides[this.activeIndex].querySelector(".text").innerHTML;
        dynamicTextDouble.setAttribute("translate", this.slides[this.activeIndex].querySelector(".text").attributes["translate"].value);
        dynamicTextReserve.innerHTML = this.slides[this.activeIndex].querySelector(".text").innerHTML;
        dynamicTextReserve.setAttribute("translate", this.slides[this.activeIndex].querySelector(".text").attributes["translate"].value);
        dynamicSubtext.innerHTML = this.slides[this.activeIndex].querySelector(".subtext").innerHTML;
        dynamicSubtext.setAttribute("translate", this.slides[this.activeIndex].querySelector(".subtext").attributes["translate"].value);

        $sliderCharsRefactor.removeClass("prodIcons-index-0");
        $sliderCharsRefactor.removeClass("prodIcons-index-1");
        $sliderCharsRefactor.removeClass("prodIcons-index-2");
        $sliderCharsRefactor.removeClass("prodIcons-index-3");
        $sliderCharsRefactor.removeClass("prodIcons-index-4");
        $sliderCharsRefactor.removeClass("prodIcons-index-5");
        $sliderCharsRefactor.removeClass("prodIcons-index-6");
        // $sliderCharsRefactor.removeClass("prodIcons-index-" + this.slides[this.previousIndex].dataset.swiperSlideIndex);
        $sliderCharsRefactor.addClass("prodIcons-index-" + this.slides[this.activeIndex].dataset.swiperSlideIndex);
    });

    swiper2.on('slideChangeTransitionStart', function() {
        if (prohodDone) {
            triggerSlidePrevEnable();
        }
        if (this.activeIndex == 1 || this.activeIndex == 6) {
            swiperCube.slideTo(0);
        } else if (this.activeIndex == 2) {
            swiperCube.slideTo(1);
        } else if (this.activeIndex == 3) {
            swiperCube.slideTo(2);
        } else if (this.activeIndex == 4 || this.activeIndex == 5) {
            swiperCube.slideTo(3);
        }
    });


    var swiperDop = new Swiper(".slider-dop", {
        init: false,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
        effect: "fade",
        loop: true,
        slidesPerView: 1,
        speed: 500,
        pagination: {
            el: '.slider-dop__wrap + .swiper-pagination-container .swiper-pagination',
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
                var namesDop = [];
                $(".js-sliderdemo-dop .swiper-slide .name").each(function(i) {
                    namesDop.push($(this).html());
                });
                var text = "";
                for (let i = 1; i <= total; i++) {
                    let j = i;
                    if (current == i) {
                        text += "<span class='cell-6 cell-4-lg cell-2-xs swiper-pagination-btn swiper-pagination-bullet swiper-pagination-btn-active'><div class='centered-btn'>" + namesDop[j] + "</div></span>";
                    } else {
                        text += "<span class='cell-6 cell-4-lg cell-2-xs swiper-pagination-btn swiper-pagination-bullet'><div class='centered-btn'>" + namesDop[j] + "</div></span>";
                    }
                }
                return text;
            },
        },
    });


    var swiper4 = new Swiper(".slider-gallery", {
        init: false,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
        effect: "fade",
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.slider-gallery .swiper-button-next',
            prevEl: '.slider-gallery .swiper-button-prev',
        },
    });
    swiper4.autoplay.stop();


    // ST‑01 
    var ended0 = [];
    $(".js-sliderdemo-0 .swiper-slide").each(function(i) {
        ended0.push($(this).data("ended"));
    });
    var swiper3prod0 = new Swiper('.js-sliderdemo-0', {
        effect: "fade",
        loop: false,
        speed: 700,
        pagination: {
            el: '.js-sliderdemo-0 + .swiper-pagination',
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
                var text = "";

                var names0 = [];

                $(".js-sliderdemo-0 .swiper-slide .videoname").each(function(i) {
                    names0.push($(this).html());
                });
                for (let i = 1; i <= total; i++) {
                    let j = i - 1
                    if (current == i) {
                        text += "<span data-played='" + ended0[j] + "' class='swiper-pagination-bullet swiper-pagination-bullet-active'><div class='centered-bullet'>" + names0[j] + "</div></span>";
                    } else {
                        text += "<span data-played='" + ended0[j] + "' class='swiper-pagination-bullet'><div class='centered-bullet'>" + names0[j] + "</div></span>";
                    }
                }
                return text;
            },
        },
    });

    var $sliderVideos0 = $(".js-sliderdemo-0 .swiper-slide video");
    $sliderVideos0.each(function(index) {
        this.addEventListener('ended', () => {
            // if slider-cube .swiper-wrapper .swiper-slide-active have video0 { 
            if (swiper3prod0.activeIndex == swiper3prod0.slides.length - 1) {
                swiper3prod0.slideTo(0)
            } else {
                swiper3prod0.slideNext();
            }
            // }
        });
        this.addEventListener('playing', () => {
            ended0[swiper3prod0.activeIndex] = 1;
            swiper3prod0.pagination.update();
        });
    });

    swiper3prod0.on('slideChange', function() {
        let currentVideo = swiper3prod0.slides[swiper3prod0.activeIndex].children[0].children[0];
        let prevVideo = swiper3prod0.slides[swiper3prod0.previousIndex].children[0].children[0];
        $sliderVideos0.each(function(index) {
            if (!this.paused) {
                this.pause();
            }
        });
        if (swiperCube.activeIndex == 0) {
            var currSwiperSlide = document.getElementById(currentVideo.id).parentNode.parentNode;
            asyncPlay(currentVideo);
            if (currSwiperSlide.style.opacity != 1 && currSwiperSlide.classList.contains("swiper-slide-active")) {
                setTimeout(() => currSwiperSlide.style.opacity = 1, 1000);
            }
            $("#products-cube").addClass("playback-started");
            prevVideo.pause();
        }
        if (intViewportWidth < 640) {
            var activeBullet = this.el.nextElementSibling.querySelector('.swiper-pagination-bullet-active')
            var bulletsWrap = this.el.nextElementSibling;
            smoothBulletsScrollLeft(activeBullet, bulletsWrap, intViewportWidth);
        }
    });

    // ST‑11  
    var ended1 = [];
    $(".js-sliderdemo-1 .swiper-slide").each(function(i) {
        ended1.push($(this).data("ended"));
    });
    var swiper3prod1 = new Swiper('.js-sliderdemo-1', {
        effect: "fade",
        loop: false,
        speed: 700,
        pagination: {
            el: '.js-sliderdemo-1 + .swiper-pagination',
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {

                var names1 = [];

                $(".js-sliderdemo-1 .swiper-slide .videoname").each(function(i) {
                    names1.push($(this).html());
                });
                var text = "";
                for (let i = 1; i <= total; i++) {
                    let j = i - 1
                    if (current == i) {
                        text += "<span data-played='" + ended1[j] + "' class='swiper-pagination-bullet swiper-pagination-bullet-active'><div class='centered-bullet'>" + names1[j] + "</div></span>";
                    } else {
                        text += "<span data-played='" + ended1[j] + "' class='swiper-pagination-bullet'><div class='centered-bullet'>" + names1[j] + "</div></span>";
                    }
                }
                return text;
            },
        },
    });

    var $sliderVideos1 = $(".js-sliderdemo-1 .swiper-slide video");
    $sliderVideos1.each(function(index) {
        this.addEventListener('ended', () => {
            if (swiper3prod1.activeIndex == swiper3prod1.slides.length - 1) {
                swiper3prod1.slideTo(0)
            } else {
                swiper3prod1.slideNext();
            }
        });
        this.addEventListener('playing', () => {
            ended1[swiper3prod1.activeIndex] = 1;
            swiper3prod1.pagination.update();
        });
    });

    swiper3prod1.on('slideChange', function() {
        let currentVideo = swiper3prod1.slides[swiper3prod1.activeIndex].children[0].children[0];
        let prevVideo = swiper3prod1.slides[swiper3prod1.previousIndex].children[0].children[0];
        $sliderVideos1.each(function(index) {
            if (!this.paused) {
                this.pause();
            }
        });
        if (swiperCube.activeIndex == 1) {
            var currSwiperSlide = document.getElementById(currentVideo.id).parentNode.parentNode;
            asyncPlay(currentVideo);
            if (currSwiperSlide.style.opacity != 1 && currSwiperSlide.classList.contains("swiper-slide-active")) {
                setTimeout(() => currSwiperSlide.style.opacity = 1, 1000);
            }
            $("#products-cube").addClass("playback-started");
            prevVideo.pause();
        }

        if (intViewportWidth < 640) {
            var activeBullet = this.el.nextElementSibling.querySelector('.swiper-pagination-bullet-active')
            var bulletsWrap = this.el.nextElementSibling;
            smoothBulletsScrollLeft(activeBullet, bulletsWrap, intViewportWidth);
        }
    });

    // ST‑02 
    var ended2 = [];
    $(".js-sliderdemo-2 .swiper-slide").each(function(i) {
        ended2.push($(this).data("ended"));
    });
    var swiper3prod2 = new Swiper('.js-sliderdemo-2', {
        effect: "fade",
        loop: false,
        speed: 700,
        pagination: {
            el: '.js-sliderdemo-2 + .swiper-pagination',
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
                var names2 = [];
                $(".js-sliderdemo-2 .swiper-slide .videoname").each(function(i) {
                    names2.push($(this).html());
                });
                var text = "";
                for (let i = 1; i <= total; i++) {
                    let j = i - 1
                    if (current == i) {
                        text += "<span data-played='" + ended2[j] + "' class='swiper-pagination-bullet swiper-pagination-bullet-active'><div class='centered-bullet'>" + names2[j] + "</div></span>";
                    } else {
                        text += "<span data-played='" + ended2[j] + "' class='swiper-pagination-bullet'><div class='centered-bullet'>" + names2[j] + "</div></span>";
                    }
                }
                return text;
            },

        },
    });

    var $sliderVideos2 = $(".js-sliderdemo-2 .swiper-slide video");
    $sliderVideos2.each(function(index) {
        this.addEventListener('ended', () => {
            if (swiper3prod2.activeIndex == swiper3prod2.slides.length - 1) {
                swiper3prod2.slideTo(0)
            } else {
                swiper3prod2.slideNext();
            }

        });
        this.addEventListener('playing', () => {
            ended2[swiper3prod2.activeIndex] = 1;
            swiper3prod2.pagination.update();
        });
    });

    swiper3prod2.on('slideChange', function() {
        let currentVideo = swiper3prod2.slides[swiper3prod2.activeIndex].children[0].children[0];
        let prevVideo = swiper3prod2.slides[swiper3prod2.previousIndex].children[0].children[0];
        $sliderVideos2.each(function(index) {
            if (!this.paused) {
                this.pause();
            }
        });
        if (swiperCube.activeIndex == 2) {
            var currSwiperSlide = document.getElementById(currentVideo.id).parentNode.parentNode;
            asyncPlay(currentVideo);
            if (currSwiperSlide.style.opacity != 1 && currSwiperSlide.classList.contains("swiper-slide-active")) {
                setTimeout(() => currSwiperSlide.style.opacity = 1, 1000);
            }
            $("#products-cube").addClass("playback-started");
            prevVideo.pause();
        }

        if (intViewportWidth < 640) {
            var activeBullet = this.el.nextElementSibling.querySelector('.swiper-pagination-bullet-active')
            var bulletsWrap = this.el.nextElementSibling;
            smoothBulletsScrollLeft(activeBullet, bulletsWrap, intViewportWidth);
        }
    });

    // Калитка
    var ended3 = [];
    $(".js-sliderdemo-3 .swiper-slide").each(function(i) {
        ended3.push($(this).data("ended"));
    });
    var swiper3prod3 = new Swiper('.js-sliderdemo-3', {
        effect: "fade",
        loop: false,
        speed: 700,
        pagination: {
            el: '.js-sliderdemo-3 + .swiper-pagination',
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
                var text = "";
                var names3 = [];
                $(".js-sliderdemo-3 .swiper-slide .videoname").each(function(i) {
                    names3.push($(this).html());
                });
                for (let i = 1; i <= total; i++) {
                    let j = i - 1
                    if (current == i) {
                        text += "<span data-played='" + ended3[j] + "' class='swiper-pagination-bullet swiper-pagination-bullet-active'><div class='centered-bullet'>" + names3[j] + "</div></span>";
                    } else {
                        text += "<span data-played='" + ended3[j] + "' class='swiper-pagination-bullet'><div class='centered-bullet'>" + names3[j] + "</div></span>";
                    }
                }
                return text;
            },

        },
    });

    var sliderVideos3 = $(".js-sliderdemo-3 .swiper-slide video");
    sliderVideos3.each(function(index) {
        this.addEventListener('ended', () => {
            if (swiper3prod3.activeIndex == swiper3prod3.slides.length - 1) {
                swiper3prod3.slideTo(0)
            } else {
                swiper3prod3.slideNext();
            }
        });
        this.addEventListener('playing', () => {
            ended3[swiper3prod3.activeIndex] = 1;
            swiper3prod3.pagination.update();
        });
    });

    swiper3prod3.on('slideChange', function() {
        let currentVideo = swiper3prod3.slides[swiper3prod3.activeIndex].children[0].children[0];
        let prevVideo = swiper3prod3.slides[swiper3prod3.previousIndex].children[0].children[0];
        sliderVideos3.each(function(index) {
            if (!this.paused) {
                this.pause();
            }
        });
        if (swiperCube.activeIndex == 3) {
            var currSwiperSlide = document.getElementById(currentVideo.id).parentNode.parentNode;
            asyncPlay(currentVideo);
            if (currSwiperSlide.style.opacity != 1 && currSwiperSlide.classList.contains("swiper-slide-active")) {
                setTimeout(() => currSwiperSlide.style.opacity = 1, 1000);
            }
            $("#products-cube").addClass("playback-started");
            prevVideo.pause();
        }

        if (intViewportWidth < 640) {
            var activeBullet = this.el.nextElementSibling.querySelector('.swiper-pagination-bullet-active')
            var bulletsWrap = this.el.nextElementSibling;
            smoothBulletsScrollLeft(activeBullet, bulletsWrap, intViewportWidth);
        }
    });

    var swiperCubeOptions = {
        loop: false,
        effect: "cube",
        slidesPerView: 1,
        allowSlidePrev: false,
        allowTouchMove: false,
        speed: 1300,
        cubeEffect: {
            shadow: false,
            slideShadows: false,
        },
        mousewheel: {
            eventsTarget: ".slider-cube",
            releaseOnEdges: false,
        },
        navigation: {
            nextEl: '.slider-cube-nav .swiper-button-next',
            prevEl: '.slider-cube-nav .swiper-button-prev',
        },
        pagination: {
            el: ".slider-cube-nav .swiper-pagination",
            clickable: true,
        },
        on: {
            init: function() {
                $('.poster-custom').addClass("poster-custom-resize");
            },
            afterInit: function() {
                if (this.device.ios) {
                    this.params.cubeEffect = false
                }
            },
            slideChangeTransitionStart: function() {

                if (this.activeIndex == 0) {
                    swiper2.slideTo(1);
                } else if (this.activeIndex == 1) {
                    swiper2.slideTo(2);
                } else if (this.activeIndex == 2) {
                    swiper2.slideTo(3);
                } else if (this.activeIndex == 3) {
                    swiper2.slideTo(4);
                }

                if (this.activeIndex == 0) {
                    swiper3prod0.slideTo(0);
                    var prevVid = document.getElementById("prod-section-0").getElementsByTagName("video")[swiper3prod0.activeIndex];
                } else if (this.activeIndex == 1) {
                    swiper3prod1.slideTo(0);
                    var prevVid = document.getElementById("prod-section-1").getElementsByTagName("video")[swiper3prod1.activeIndex];
                } else if (this.activeIndex == 2) {
                    swiper3prod2.slideTo(0);
                    var prevVid = document.getElementById("prod-section-2").getElementsByTagName("video")[swiper3prod2.activeIndex];
                } else if (this.activeIndex == 3) {
                    swiper3prod3.slideTo(0);
                    var prevVid = document.getElementById("prod-section-3").getElementsByTagName("video")[swiper3prod3.activeIndex];
                }
                prevVid.pause();

            },
            slideChangeTransitionEnd: function() {
                if (this.isEnd) {
                    swiperCube.params.mousewheel.releaseOnEdges = true;
                } else {
                    swiperCube.params.mousewheel.releaseOnEdges = false;
                }

                if (this.activeIndex == 0) {
                    swiper3prod0.slideTo(0);
                    var targetVid = document.querySelector("#prod-section-0 video");
                } else if (this.activeIndex == 1) {
                    swiper3prod1.slideTo(0);
                    var targetVid = document.querySelector("#prod-section-1 video");
                } else if (this.activeIndex == 2) {
                    swiper3prod2.slideTo(0);
                    var targetVid = document.querySelector("#prod-section-2 video");
                } else if (this.activeIndex == 3) {
                    swiper3prod3.slideTo(0);
                    var targetVid = document.querySelector("#prod-section-3 video");
                }

                // if (intViewportWidth > 640) {
                asyncPlay(targetVid);
                // }

                $("#products-cube").removeClass("playback-started");
                // ---
                function removeZ() {
                    $(".poster-custom-resize").removeClass("poster-z");
                }
                setTimeout(removeZ, 500);
                // проходимся по всем слайдам и добавляем класс для удаления постера именно в конце анимации
                $(".remove-poster").removeClass("remove-poster");
                $(".slider-cube > .swiper-wrapper > .swiper-slide.swiper-slide-active").addClass("remove-poster");

                function addZ() {
                    $(".slider-cube > .swiper-wrapper > .swiper-slide.swiper-slide-active .poster-custom-resize").addClass("poster-z");
                }
                setTimeout(addZ, 500);
                // ---      
                // Для фикса глюка с появляющейся стрелкой
                let sliderCubeNav = $(".slider-cube-nav");
                sliderCubeNav.removeClass("sliderCube-index-" + this.previousIndex);
                sliderCubeNav.addClass("sliderCube-index-" + this.activeIndex);
                if (!(this.activeIndex == 3)) {
                    if (sliderCubeNav.hasClass("sliderCube-index-3")) {
                        sliderCubeNav.removeClass("sliderCube-index-3");
                    }
                }
            }
        }
    };

    var swiperCubeOptions2 = {
        loop: false,
        slidesPerView: 1,
        navigation: {
            nextEl: '.slider-cube-nav .swiper-button-next',
            prevEl: '.slider-cube-nav .swiper-button-prev',
        },
        pagination: {
            el: ".slider-cube-nav .swiper-pagination",
            clickable: true,
        },
        on: {
            init: function() {
                $('.poster-custom').addClass("poster-custom-resize");
            },
            afterInit: function() {
                if (this.device.ios) {
                    this.params.cubeEffect = false
                }
            },
            slideChangeTransitionStart: function() {

                if (this.activeIndex == 0) {
                    swiper2.slideTo(1);
                } else if (this.activeIndex == 1) {
                    swiper2.slideTo(2);
                } else if (this.activeIndex == 2) {
                    swiper2.slideTo(3);
                } else if (this.activeIndex == 3) {
                    swiper2.slideTo(4);
                }

                if (this.activeIndex == 0) {
                    swiper3prod0.slideTo(0);
                    var prevVid = document.getElementById("prod-section-0").getElementsByTagName("video")[swiper3prod0.activeIndex];
                } else if (this.activeIndex == 1) {
                    swiper3prod1.slideTo(0);
                    var prevVid = document.getElementById("prod-section-1").getElementsByTagName("video")[swiper3prod1.activeIndex];
                } else if (this.activeIndex == 2) {
                    swiper3prod2.slideTo(0);
                    var prevVid = document.getElementById("prod-section-2").getElementsByTagName("video")[swiper3prod2.activeIndex];
                } else if (this.activeIndex == 3) {
                    swiper3prod3.slideTo(0);
                    var prevVid = document.getElementById("prod-section-3").getElementsByTagName("video")[swiper3prod3.activeIndex];
                }
                prevVid.pause();

            },
            slideChangeTransitionEnd: function() {
                if (this.isEnd) {
                    swiperCube.params.mousewheel.releaseOnEdges = true;
                } else {
                    swiperCube.params.mousewheel.releaseOnEdges = false;
                }

                if (this.activeIndex == 0) {
                    swiper3prod0.slideTo(0);
                    var targetVid = document.getElementById("prod-section-0").getElementsByTagName("video")[swiper3prod0.activeIndex];
                } else if (this.activeIndex == 1) {
                    swiper3prod1.slideTo(0);
                    var targetVid = document.getElementById("prod-section-1").getElementsByTagName("video")[swiper3prod1.activeIndex];
                } else if (this.activeIndex == 2) {
                    swiper3prod2.slideTo(0);
                    var targetVid = document.getElementById("prod-section-2").getElementsByTagName("video")[swiper3prod2.activeIndex];
                } else if (this.activeIndex == 3) {
                    swiper3prod3.slideTo(0);
                    var targetVid = document.getElementById("prod-section-3").getElementsByTagName("video")[swiper3prod3.activeIndex];
                }

                // if (intViewportWidth > 640) {
                asyncPlay(targetVid);
                // }

                $("#products-cube").removeClass("playback-started");
                // ---
                function removeZ() {
                    $(".poster-custom-resize").removeClass("poster-z");
                }
                setTimeout(removeZ, 500);
                // проходимся по всем слайдам и добавляем класс для удаления постера именно в конце анимации
                $(".remove-poster").removeClass("remove-poster");
                $(".slider-cube > .swiper-wrapper > .swiper-slide.swiper-slide-active").addClass("remove-poster");

                function addZ() {
                    $(".slider-cube > .swiper-wrapper > .swiper-slide.swiper-slide-active .poster-custom-resize").addClass("poster-z");
                }
                setTimeout(addZ, 500);
                // ---      
                // Для фикса глюка с появляющейся стрелкой
                let sliderCubeNav = $(".slider-cube-nav");
                sliderCubeNav.removeClass("sliderCube-index-" + this.previousIndex);
                sliderCubeNav.addClass("sliderCube-index-" + this.activeIndex);
                if (!(this.activeIndex == 3)) {
                    if (sliderCubeNav.hasClass("sliderCube-index-3")) {
                        sliderCubeNav.removeClass("sliderCube-index-3");
                    }
                }
            }
        }
    };

    var swiperCube = new Swiper(".slider-cube", swiperCubeOptions);
    // пересоздаём слайдер для устройств, которые плохо переваривают 3д-эффект Cube 
    if (document.querySelector("html").classList.contains("is-os-mac-os") || document.querySelector("html").classList.contains("is-os-ios")) {
        swiperCube.destroy();
        var swiperCube = new Swiper(".slider-cube", swiperCubeOptions2);
    }
    swiperCube.mousewheel.disable();

    var $sliderVideosAll = $("#products-cube .swiper-slide video");
    $sliderVideosAll.each(function(index) {
        this.addEventListener('play', (event) => {
            // console.log(event);
        });
    });

    const triggerSlidePrevEnable = function(event) {
        if (swiperCube.mousewheel.enabled) {
            swiperCube.mousewheel.disable();
        }
        if (!swiperCube.allowSlidePrev) {
            swiperCube.allowSlidePrev = true;
        }
    };

    var firstEnterDone = false;
    var easeTime = .3;

    var controlScene = function(event) {
        swiperCube.allowSlidePrev = false;
        if (!prohodDone) {
            if (!firstEnterDone && event.deltaY > 0) {
                setTimeout(() => swiperCube.mousewheel.enable(), 2000);
                firstEnterDone = true;
                // gsap.to(window, {
                //     delay: 0,
                //     duration: easeTime,
                //     scrollTo: "#products-cube",
                //     onComplete: function() {
                //         swiperCube.mousewheel.enable();
                //     }
                // });
            } else if ((swiperCube.activeIndex == 3 && swiperCube.params.mousewheel.releaseOnEdges && event.wheelDeltaY < 0) || (event.deltaY < 0)) { // move down only on last slide or if wheel "up"
                prohodDone = true;
                triggerSlidePrevEnable();
                showHidedSections();
            }
        }
    };
    inView.threshold(.5);
    var alreadyExitOnce = false;
    var alreadyEnteredOnce = false;
    inView('#products-cube')
        .on('enter', el => {
            if (alreadyExitOnce) {
                if (swiperCube.activeIndex == 0) {
                    var currentVideo = swiper3prod0.slides[swiper3prod0.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 1) {
                    var currentVideo = swiper3prod1.slides[swiper3prod1.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 2) {
                    var currentVideo = swiper3prod2.slides[swiper3prod2.activeIndex].children[0].children[0];
                } else if (swiperCube.activeIndex == 3) {
                    var currentVideo = swiper3prod3.slides[swiper3prod3.activeIndex].children[0].children[0];
                } else {}
                // if (intViewportWidth > 640) {
                asyncPlay(currentVideo);
                // }
            } else if (alreadyEnteredOnce) {
                swiperCube.slides[swiperCube.activeIndex].classList.add("remove-poster");
            }
            alreadyEnteredOnce = true;
            document.addEventListener('wheel', controlScene);

            el.addEventListener('touchstart', triggerSlidePrevEnable, false);
            el.addEventListener('touchmove', triggerSlidePrevEnable, false);
        })
        .on('exit', el => {
            alreadyExitOnce = true;
            document.removeEventListener('wheel', controlScene);
            if (swiperCube.activeIndex == 0) {
                var currentVideo = swiper3prod0.slides[swiper3prod0.activeIndex].children[0].children[0];
            } else if (swiperCube.activeIndex == 1) {
                var currentVideo = swiper3prod1.slides[swiper3prod1.activeIndex].children[0].children[0];
            } else if (swiperCube.activeIndex == 2) {
                var currentVideo = swiper3prod2.slides[swiper3prod2.activeIndex].children[0].children[0];
            } else if (swiperCube.activeIndex == 3) {
                var currentVideo = swiper3prod3.slides[swiper3prod3.activeIndex].children[0].children[0];
            } else {}
            currentVideo.pause();
        })

    if (intViewportWidth < 640) {

        var cubeContainer = document.querySelector("#products-cube");
        var itemsToDisableSwiperTouch = cubeContainer.querySelectorAll("#products-cube .swiper-pagination-custom");

        itemsToDisableSwiperTouch.forEach(function(item) {
            const disableTouchEvent = function(event) {
                if (swiperCube.allowTouchMove) {
                    swiperCube.allowTouchMove = false;
                }
            };
            const enableTouchEvent = function(event) {
                if (!swiperCube.allowTouchMove) {
                    swiperCube.allowTouchMove = true;
                }
            };
            item.addEventListener('touchstart', disableTouchEvent, false);
            item.addEventListener('touchmove', disableTouchEvent, false);
            item.addEventListener('touchend', enableTouchEvent, false);
            item.addEventListener('touchcancel', enableTouchEvent, false);
        });

        var vidsForMobile = document.getElementsByTagName("video");
        for (var i = 0; i < vidsForMobile.length; i++) {
            vidsForMobile[i].removeAttribute("autoplay");
        }

    }

    document.querySelector('.feedback-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const response = await fetch('/', {
            method: 'POST',
            body: new FormData(this)
        });
        if (!response.ok) {
            console.error(`Ошибка отправки формы, статус ответа: ${response.status}`);
            return;
        }
        if (await response.text() != '0') {
            Fancybox.show([{
                html: document.getElementById('form-result-content')
            }], {
                on: {
                    done: (fancybox, slide) => {
                        document.querySelector(".feedback-form-btn").classList.add("btn-block");
                        setTimeout(function() {
                            fancybox.close();
                        }, 5000);
                    }
                }
            });
            return;
        }
    });


    $("[data-prod-slide]").on("click", function(e) {
        e.preventDefault;
        gsap.to(window, { delay: 0, duration: easeTime, scrollTo: "#products" });
        swiper2.slideTo($(this).data("prod-slide"));
    });

    $("[data-prod-section]").on("click", function(e) {
        e.preventDefault;
        gsap.to(window, { delay: 0, duration: easeTime, scrollTo: "#products-cube" });
        swiperCube.allowSlidePrev = true;
        swiperCube.slideTo($(this).data("prod-section"));
        swiperCube.allowSlidePrev = false;
    });

    $("#products-cube .swiper-button-prev").on("click", function(e) {
        if (!swiperCube.allowSlidePrev) {
            triggerSlidePrevEnable();
            swiperCube.slidePrev();
        }
    });


    $("#products-cube .slider-cube-nav .swiper-pagination").on("click", function(e) {
        if (!swiperCube.allowSlidePrev) {
            triggerSlidePrevEnable();
            console.log(e.originalEvent.explicitOriginalTarget.click());
        }
    });

    $('[href="#advantages"], [href="#products"]').on("click", function() {
        showHidedSections();
        // hideHidedSections();
    })

    $('[href="#gallery"], [href="#about"], [href="#write-us"]').on("click", function() {
        showHidedSections();
        swiper4.init();
        swiper4.on('afterInit', function() {
            // якорь по центру фотогалереи
            anchorPhotoGallery();
            positionArrowsGallery();
        });
    })

    $('.slider-cube .swiper-pagination').on("click", triggerSlidePrevEnable());

    var inptPhoneMask = new Inputmask("8(999)999-9999");
    var inptPhoneMaskEn = new Inputmask("+9[9*{1,20}]");
    var inptEmaiMask = new Inputmask({
        mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
        greedy: false,
        onBeforePaste: function(pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
        },
        definitions: {
            '*': {
                validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                casing: "lower"
            }
        }
    });
    inptPhoneMaskEn.mask(document.getElementById("js-input-phone"));
    inptEmaiMask.mask(document.getElementById("js-input-email"));

    //   input.oninput = function() {
    //     result.innerHTML = input.value;
    //   }; 

    // $('.play-button__link').on("click", function(e) {
    //     console.log(e.currentTarget.offsetParent.children[0].children[0].play());
    //     var targetPlay = e.currentTarget.offsetParent.children[0].children[0]
    //     targetPlay.play().catch((e) => {
    //         console.log(e); 
    //     });
    //     $("#products-cube").addClass("playback-started");
    // });

    var sectionHero = document.querySelector(".slider-hero");
    var sectionGallery = document.querySelector(".three");
    var sectionDopProd = document.querySelector(".slider-dop");
    sectionHero.addEventListener('click', function(event) {
        console.log(swiper1.slideNext());
    });
    sectionGallery.addEventListener('click', function(event) {
        console.log(swiper4.slideNext());
    });
    sectionDopProd.addEventListener('click', function(event) {
        console.log(swiperDop.slideNext());
    });


    var swiper1 = new Swiper(".slider-hero", {
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
        effect: "fade",
        loop: true,
        speed: 1300,
        fadeEffect: {
            crossFade: false
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".slider-hero .swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: '.slider-hero .swiper-button-next',
            prevEl: '.slider-hero .swiper-button-prev',
        },
        on: {
            init: function() {
                setTimeout(function() {
                    document.querySelector(".hero").classList.add("swiper-initted");
                }, 1000);
            },
            slideChange: function(swiper) {
                let dynamicSubtext = document.getElementById("js-dynamic-subtext-1");
                dynamicSubtext.innerHTML = swiper.slides[swiper.activeIndex].querySelector(".subtext").innerHTML;
                dynamicSubtext.setAttribute("translate", swiper.slides[swiper.activeIndex].querySelector(".subtext").attributes["translate"].value)
            }
        },
    });

    // Перевод страницы по клику
    $(function() {
        $('.select-lang__item').on('click', function(e) {
            e.preventDefault();
            $(".select-lang__name").html($(this).attr('id').toUpperCase());
            curr_lang = $(this).attr('id');

            var inptPhoneMask = new Inputmask("8(999)999-9999");

            var matches = $('body').attr('class').match(/\blang-is-\S+/g);
            $.each(matches, function() {
                var className = this;
                $('body').removeClass(className.toString());
            });
            $("body").addClass("lang-is-" + curr_lang);
            $('.lang').each(function() {
                $(this).text(arrLang[curr_lang][$(this).attr('translate')]);
            });

            var names0 = [];
            var names1 = [];
            var names2 = [];
            var names3 = [];
            var namesDop = [];
            $(".js-sliderdemo-dop .swiper-slide").each(function(i) {
                namesDop.push($(this).data("name"));
            });

            $(".js-sliderdemo-0 .swiper-slide .videoname").each(function(i) {
                names0[i] = $(this).html();
            });
            swiper3prod0.pagination.update();
            $(".js-sliderdemo-1 .swiper-slide .videoname").each(function(i) {
                names1[i] = $(this).html();
            });
            swiper3prod1.pagination.update();
            $(".js-sliderdemo-2 .swiper-slide .videoname").each(function(i) {
                names2[i] = $(this).html();
            });
            swiper3prod2.pagination.update();
            $(".js-sliderdemo-3 .swiper-slide .videoname").each(function(i) {
                names3[i] = $(this).html();
            });
            if (swiperDop.params.init == false) {
                swiperDop.init();
            }
            swiper3prod3.pagination.update();
            $(".js-sliderdemo-dop .swiper-slide .name").each(function(i) {
                namesDop[i] = $(this).html();
            });
            swiperDop.pagination.update();
            $(".feedback-form-label__input").each(function(i) {
                $(this)[0].placeholder = arrLang[curr_lang][$(this).attr('translate')]
            });
        });
    });

    // Перевод страницы при загрузке
    $(function() {
        // curr_lang = "ru";
        // curr_lang = "en";
        var matches = $('body').attr('class').match(/\blang-is-\S+/g);
        $.each(matches, function() {
            var className = this;
            $('body').removeClass(className.toString());
        });
        $("body").addClass("lang-is-" + curr_lang);
        $('.lang').each(function() {
            $(this).text(arrLang[curr_lang][$(this).attr('translate')]);
        });

        var names0 = [];
        var names1 = [];
        var names2 = [];
        var names3 = [];
        var namesDop = [];
        $(".js-sliderdemo-dop .swiper-slide").each(function(i) {
            namesDop.push($(this).data("name"));
        });

        $(".js-sliderdemo-0 .swiper-slide .videoname").each(function(i) {
            names0[i] = $(this).html();
        });
        swiper3prod0.pagination.update();
        $(".js-sliderdemo-1 .swiper-slide .videoname").each(function(i) {
            names1[i] = $(this).html();
        });
        swiper3prod1.pagination.update();
        $(".js-sliderdemo-2 .swiper-slide .videoname").each(function(i) {
            names2[i] = $(this).html();
        });
        swiper3prod2.pagination.update();
        $(".js-sliderdemo-3 .swiper-slide .videoname").each(function(i) {
            names3[i] = $(this).html();
        });
        if (swiperDop.params.init == false) {
            swiperDop.init();
        }
        swiper3prod3.pagination.update();
        $(".js-sliderdemo-dop .swiper-slide .name").each(function(i) {
            namesDop[i] = $(this).html();
        });
        swiperDop.pagination.update();
        $(".feedback-form-label__input").each(function(i) {

            $(this)[0].placeholder = arrLang[curr_lang][$(this).attr('translate')]
        });
    });

    if (location.hostname == "localhost") {
        if (isCookie == undefined) {
            document.getElementById('js-cookie-warning').style.display = "block";
            setCookie("firstVisit", "", {
                expires: 86400 * 365
            })
        }
    }
    if (location.hostname == "perco.local" || location.hostname == "www.perco.local") {
        if (isCookie == undefined) {
            document.getElementById('js-cookie-warning').style.display = "block";
            setCookie("firstVisit", "", {
                expires: 86400 * 365
            })
        }
    }
    if (location.hostname == "speedgate.perco.ru") {
        if (isCookie == undefined) {
            document.getElementById('js-cookie-warning').style.display = "block";
            setCookie("firstVisit", "", {
                expires: 86400 * 365
            })
        }
    }
    if (location.hostname == "speedgate.perco.com") {
        if (isCookie == undefined) {
            document.getElementById('js-cookie-warning').style.display = "block";
            setCookie("firstVisit", "", {
                expires: 86400 * 365
            })
        }
    }
};

window.addEventListener(`resize`, event => {
    var intViewportHeight = window.innerHeight;
    var elsToResize = document.querySelectorAll(".js-video-main-wrap");
    var sliderArrows = document.querySelector(".slider-cube-relative");

    if (intViewportHeight < 851) {
        elsToResize.forEach(function(node) {
            node.classList.add('push-3', 'cell-6', 'post-3');
            node.classList.remove('push-2', 'cell-8', 'post-2');
        });
        sliderArrows.classList.add('push-2', 'cell-8', 'post-2');
        sliderArrows.classList.remove('push-1', 'cell-10', 'post-1');
    } else {
        elsToResize.forEach(function(node) {
            node.classList.add('push-2', 'cell-8', 'post-2');
            node.classList.remove('push-3', 'cell-6', 'post-3');
        });
        sliderArrows.classList.add('push-1', 'cell-10', 'post-1');
        sliderArrows.classList.remove('push-2', 'cell-8', 'post-2');
    }

    // якорь по центру фотогалереи
    anchorPhotoGallery();


}, false);