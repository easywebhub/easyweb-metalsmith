function SearchToTop() {
    var top = document.getElementById("searchNav").offsetTop;
    window.scrollTo(0, top);
}
function tragopToTop(){
    var top = document.getElementById("tragop-progress").offsetTop;
    window.scrollTo(0, top - 10);
}

/**
 * This module sets up the search bar.
 */

!function () {

    var source = {
        // Only show 10 results at once
        limit: 10,

        // Function to fetch result list and then find a result;
        source: function (query, sync, async) {
            query = query.toLowerCase();

            $.getJSON('listItem.json', function (data, status) {
                async(data.filter(function (elem, i, arr) {
                    var name = elem.name.toLowerCase();
                    var terms = [name, name.replace('-', '')].concat(elem.tags || []);
                    for (var i in terms) if (terms[i].indexOf(query) > -1) return true;
                    return false;
                }));
            });
        },

        // Name to use for the search result itself
        display: function (item) {
            return item.name;
        },

        templates: {
            // HTML that renders if there are no results
            notFound: function (query) {
                return '<div class="tt-empty">Không tìm thấy kết quả cho "' + query.query + '".</div>';
            },
            // HTML that renders for each result in the list
            suggestion: function (item) {
                return '<div><span class="name">' + item.name + '</span></span> <span class="price">' + item.price.new + ' đ</span></div>';
            }
        }
    }
// Search
    $('[data-products-search]')
        .typeahead({highlight: false}, source)
        .on('typeahead:select', function (e, sel) {
            window.location.href = sel.link;
        });

// Auto-highlight unless it's a phone
    if (!navigator.userAgent.match(/(iP(hone|ad|od)|Android)/)) {
        $('[data-docs-search]').focus();
    }

}();


if ($(".swiper-container").length != 0) {
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        preloadImages: false,
        autoplay: 6000,
        autoplayDisableOnInteraction: false,
    });
}


if ($(".swiper-popover").length != 0) {
    var swiperPopover = new Swiper('.swiper-popover', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true,
        onSlideChangeStart: function () {
            $(".start_index").html(swiperPopover.activeIndex + 1)
        }
    });

    $(".end_index").html(swiperPopover.slides.length)

}


var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 230,
    'tolerance': 70,
    'touch': false,
    'duration': 400

});

if (document.querySelector('.toggle-button') !== null) {
// Toggle button
    document.querySelector('.toggle-button').addEventListener('click', function (event) {
        event.preventDefault()
        slideout.toggle();
    });
}


//Close when click outside
function checkOpen(eve) {
    if (slideout.isOpen()) {
        eve.preventDefault();
        slideout.close();
    }
}

function addClick() {
    document.querySelector('#panel').addEventListener('click', checkOpen);
}

function removeClick() {
    document.querySelector('#panel').removeEventListener('click', checkOpen);
}
slideout.on('open', addClick);
slideout.on('close', removeClick);


if ($('.countdown').length) {
    $('.countdown').each(function () {
        var date = $(this).attr('data-date');
        $(this).countdown(date, function (event) {
            var $this = $(this).html(event.strftime(''
                + '<div class="c-element"><span>%D</span>  </div><span class="haicham">:</span> '
                + '<div class="c-element"><span>%H</span>  </div><span class="haicham">:</span> '
                + '<div class="c-element"><span>%M</span> </div> <span class="haicham">:</span>'
                + '<div class="c-element"><span>%S</span> </div>'));
        });
    });
}


!(function () {
    var main = $("#panel");
    var scrollPosition = $(window).scrollTop();

    $(".popover-trigger").each(function () {
        var $this = $(this);
        var id = $this.attr('data-popover'),
            popover = $("#" + id),
            close = popover.find(".popover__close");

        function removeOverlay() {
            popover.addClass("popover-visuallyhidden");
            popover.one('transitionend', function (e) {
                popover.addClass('popover-hidden');
            });
            setTimeout(function () {
                main.removeClass('popover-hidden');
                $(window).scrollTop(scrollPosition);
                setTimeout(function () {
                    main.removeClass('popover-visuallyhidden');
                }, 20);
            }, 100);

        }

        $this.click(function (e) {
            e.preventDefault();
            scrollPosition = $(window).scrollTop();

            // main.css("display", "none");
            main.addClass("popover-visuallyhidden");
            main.one('transitionend', function (e) {
                main.addClass('popover-hidden');
                $(window).scrollTop(0);
            });

            setTimeout(function () {
                popover.removeClass('popover-hidden');
                if (swiperPopover != undefined) {
                    swiperPopover.update();
                }
                setTimeout(function () {
                    popover.removeClass('popover-visuallyhidden');
                }, 20);
            }, 300);
        });
        close.click(function (e) {
            e.preventDefault();
            removeOverlay();
        })
    });
})();

// Load video

$('.youtube-thumbnail').on('click', function () {
    var url = $(this).attr('data-video-id');
    player.cueVideoById(url);
});

function showContentCheckbox(nameCheckbox) {
    var allCheckbox = [];
    var selection = $("input[name='" + nameCheckbox + "']");
    selection.each(function () {
        allCheckbox.push($(this).data("chosen"));
    });

    selection.on("change", function () {

        var name = $("#" + $(this).data("chosen"));

        if (!this.checked) {
            name.hide();
            return
        }
        ;

        for (var i = 0; i < allCheckbox.length; i++) {
            $("#" + allCheckbox[i]).hide();
        }
        name.fadeIn();
    });
}

showContentCheckbox("RecieveType");
showContentCheckbox("PaymentType");
showContentCheckbox("PaymentMethod");
showContentCheckbox("xuathoadon");





function showContentFilter(nameFilter) {
    var allFilter = [];
    var selection = $("[name='" + nameFilter + "']");
    selection.each(function () {
        allFilter.push($(this).data("filter"));
    });

    selection.on("click", function (e) {
        $this = $(this);
        var name = $("#" + $this.data("filter"));

        if ($this.hasClass("active")) {
            name.fadeOut("fast");
            $this.removeClass("active");
            return;
        } else {
            $this.siblings().removeClass("active");
        }

        $this.addClass("active");

        for (var i = 0; i < allFilter.length; i++) {
            $("#" + allFilter[i]).hide();
        }
        name.fadeIn("fast");
    });
}

showContentFilter("filters");
/*Reply comments*/
$(function () {
    $(".reply-comment-btn").click(function (e) {
        e.preventDefault();
        $(this).parent().children(".comment-replay").slideToggle("fast");
    });
});

/*End reply comments*/


/*CHECK FORM DAT HANG STEP BY STEP, ap dung sau*/
$(function () {
    var formDathang1 = $("#formDathang1"),
        formDathang2 = $("#formDathang2"),
        formDathang3 = $("#formDathang3");

    formDathang1.on("formvalid.zf.abide", function (ev, frm) {
        formDathang1.fadeOut();
        formDathang2.fadeIn();
        $("body").addClass("formDathang-step2");
    });
    formDathang1.on("submit", function (ev) {
        ev.preventDefault();
    });

    formDathang2.on("formvalid.zf.abide", function (ev, frm) {
        formDathang2.fadeOut();
        formDathang3.fadeIn();
        $("body").removeClass("formDathang-step2").addClass("formDathang-step3");
    });
    formDathang2.on("submit", function (ev) {
        ev.preventDefault();
    });
});


/*end CHECK FORM DAT HANG STEP BY STEP, ap dung sau*/


// Mua tra gop
$(function () {
    var current_tragop, next_tragop, previous_tragop;

    $(".tragop-next").click(function (e) {
        e.preventDefault();

        $this = $(this);
        current_tragop = $this.parents(".tragop-step").hide();
        next_tragop = $this.parents(".tragop-step").next().fadeIn();
        $("#tragop-progress li").eq($(".tragop-step").index(next_tragop)).addClass("active");
        tragopToTop();
    });

    $(".tragop-prev").click(function (e) {
        e.preventDefault();
        $this = $(this);
        current_tragop = $this.parents(".tragop-step").hide();
        previous_tragop = $this.parents(".tragop-step").prev().fadeIn();
        $("#tragop-progress li").eq($(".tragop-step").index(current_tragop)).removeClass("active");
        tragopToTop();
    });
});


// end Mua tra gop



//For horinav

// var horiNav = {
//     container: $(".horinav"),
//     list: $(".horinav__list"),

//     config: {

//     },
//     init : function(){

//     },


// };

//  $('.nav-menu ul').scrollLeft($('.nav-menu ul li.active').offset().left / 2)

// var contactForm = {
        
//         container:  $('#contact'),
        
//         config: {
//             effect : 'slideToggle',
//             speed: 500
//         },
        
//         init: function(config){
            
//             $.extend(this.config, config);
            
//             $('<button></button>', {
//                 text: 'Contact me'
//             })
//             .insertAfter('article:first')
//             .on('click', this.show)
//         },
        
//         show: function(){
            
//             var cf = contactForm,
//                 container = cf.container,
//                 config = cf.config;
            
//             if(container.is(':hidden')){
//                 contactForm.close.call(container);
//                 container[config.effect](config.speed);
//             }
//         },
        
//         close: function(){
//             var $this = $(this);
            
//             if($this.find('span.close').length) return;
            
//             $('<span class="close">X</span>')
//             .prependTo(this)
//             .on('click', function(){
//                 $this[contactForm.config.effect](contactForm.config.speed);
//             })
//         }
        
        
//     };
    

    