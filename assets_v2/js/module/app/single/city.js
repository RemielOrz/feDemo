/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
define(["OE","Menu","lazyload","_","Loading","Swipe","AsideWindow"],function(OE,Menu,lazyload,_,Loading,Swipe,AsideWindow){
    console.log('Page Module: city');
    var $ = OE.$;
    var u = OE.utils;
    var times = 1;
    function fn(){
        OE.log('Page:[city], Times:' ,times++);
        Loading.hide();
        $.get(OE.BASE_URL+'/template/trip/tpl_destination_city.html', function(html){
            console.log('template [tpl_destination_city.html] onload');
            var $html = $(html);
            var compiled = _.template($html.html());
            $('.wrapper').append(compiled({}));

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


            $('.__poi-item').asideWindow({
                setContent: function(el){
                    OE.log(el);
                    $(el).append(compiled({}));
                    $(el).find("[lazyload]").lazyload(function(e){console.log(e)});

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
    }

    return fn;
});

