/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
define(["OE","Swipe","lazyload","AsideWindow","_"],function(OE,Swipe,lazyload,AsideWindow,_){
    console.log('Page Module: trip-daily');
    var $ = OE.$;
    var u = OE.utils;

    /*var $carousel = $('.m-carousel'),
        $carousel__item = $carousel.find('li');
    if($carousel__item.length > 1){
        $carousel
            .on(u.events.down + ' ' + u.events.move + ' ' + u.events.up, function(e){
                //阻止触发滑出菜单
                e.stopPropagation();
            })
            .carousel();
    }*/

    var $swipe = $('.swipe')
        ,$swipe__item = $swipe.find('.swipe-item');
    if($swipe__item.length > 1){
        var theSwipe = Swipe($swipe[0], {
            startSlide: 0,
            auto: 2000,
            continuous: true,
            disableScroll: true,
            stopPropagation: true,
            callback: function(index, element) {},
            transitionEnd: function(index, element) {}
        });
    }

    $("[lazyload]").lazyload(function(e){console.log(e)});

    $.get(OE.BASE_URL + '/template/trip/tpl_trip_poi.html', function(html){
        var $html = $(html);
        var compiled = _.template($html.html());
        //$('.wrapper').append(compiled(data));
        $('.__poi-item').asideWindow({
            //speed:1,
            setContent: function(el){
                /*console.log(el._poiData);
                if(!el._poiData){
                    el._poiData = 1;
                }*/
                $(el).append(compiled({}));
                $(el).find("[lazyload]").lazyload(function(e){console.log(e)});

                /*var $carousel = $(el).find('.m-carousel'),
                    $carousel__item = $carousel.find('li');
                if($carousel__item.length > 1){
                    $carousel
                        .on(u.events.down + ' ' + u.events.move + ' ' + u.events.up, function(e){
                            //阻止触发滑动事件
                            e.stopPropagation();
                            e.preventDefault();
                        })
                        .carousel();
                }*/

                var $swipe = $(el).find('.swipe')
                    ,$swipe__item = $swipe.find('.swipe-item');
                if($swipe__item.length > 1){
                    var theSwipe = Swipe($swipe[0], {
                        startSlide: 0,
                        auto: 2000,
                        continuous: true,
                        disableScroll: true,
                        stopPropagation: true,
                        callback: function(index, element) {},
                        transitionEnd: function(index, element) {}
                    });
                }
            },
            dir: 'right'
        })
    });
});

