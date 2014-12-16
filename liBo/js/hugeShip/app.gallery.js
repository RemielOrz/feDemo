/*!
 * Created By remiel.
 * Date: 14-5-22
 * Time: 上午9:36
 */

//lazyload
$.fn.lazyload = function(callback){
    return this.each(function(index, item){
        var $item = $(item);
        $item.addClass('img_hide');
        var src = $item.attr('lazyload');
        var img = document.createElement('img');
        img.onload = function() {
            item.src = src;
            $item.addClass('img_show').removeClass('img_hide').removeAttr('lazyload');
            typeof callback === 'function' && callback.call(this, 'onload');
        };
        img.onerror= function() {
            console.log('img lazyload onerror');
            typeof callback === 'function' && callback.call(this, 'onerror');
        };
        img.src = src;
    });
};

//分享相关
$(function(){
    //分享
    var shareInfo = {
        img: window.OE&&OE.shareImg ? OE.shareImg : 'http://weijing.qiniudn.com/shipimg_share.jpg',
        url: window.OE && OE.shareLink ? OE.shareLink : location.protocol+'//'+location.host+location.pathname+location.hash+location.search+'#',
        title: window.OE && OE.title? OE.title : OE.userName + '想和你一起体验浪漫豪华邮轮之旅',
        desc: window.OE && OE.content? OE.content : '全球几乎最美的天堂，一生必去的50个地方之一。微景旅游免费送你去。'
    };
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            WeixinJSBridge.invoke('sendAppMessage',{
                "img_url":shareInfo.img,
                "link":shareInfo.url,
                "desc":shareInfo.desc,
                "title":shareInfo.title
            }, function(res){(conf.callback)();});
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            WeixinJSBridge.invoke('shareTimeline',{
                "img_url":shareInfo.img,
                "link":shareInfo.url,
                "desc":shareInfo.desc,
                "title":shareInfo.title + ' | ' + shareInfo.desc
            }, function(res){});
        });
    });
    //分享指引弹出层
    $('.wx_indicator, .js-show-indicator').on('click', function(){
        $('.wx_indicator').toggle();
    });

});

$(function() {
    var $list = $('.m-carousel-inner'),
        $item = $list.find('li'),
        $carouselObj = $('.m-carousel');

    loadImg($item.eq(0), function(){
        var curLi = $item.eq(0);
        setCharImg(curLi, true);
        loadImg(curLi.next());
        setTimeout(function(){
            setCounter(curLi);
            setArrow(curLi);
        }, 1400);

    });
    $carouselObj
        .carousel()
        .on('afterSlide', function(){
            var $activeItem = $list.find('.m-active');
            var activeIndex = $activeItem.index(),
                curLi = $item.eq(activeIndex);
            setCharImg(curLi, false);
            if(activeIndex < $item.length-1){
                var nextLi = curLi.next();
                loadImg(nextLi);
            }
            else {
//                copyList($item);
            }
    });

    function loadImg(el, callback){
        el.find('img[lazyload]').lazyload(function(){
            typeof callback === 'function' && callback.call(this);
        });
    }

    function setCharImg(li) {
        var $img_char = li.children('.js-img-char'),
            $img_bg = li.children('.js-img-bg');
        if($img_bg[0].complete){
            showCharImg($img_char);
        }
        else {
            $img_bg[0].addEventListener('load', function(){
                var img_char = $img_char;
                showCharImg($img_char);
            })
        }
    }

    function showCharImg(img_char){
        setTimeout(function(){
            img_char.addClass('show');
        }, 500);
    }

    function setArrow(li){
        setTimeout(function(){
            li.children('.js-arrow').toggleClass('show');
//            setTimeout('setArrow(li)', 400);
        }, 400);
    }

    function setCounter(li){
        li.children('.js-counter').addClass('show');
    }

    function copyList(){
        var $parent = $item.closest('ul'),
            $cloneList = $item.clone();
        $parent.append($cloneList);
    }
});

