/*!
 * Created By remiel.
 * Date: 14-04-21
 * Time: 下午3:09
 */

$(function(){
    //lazyload
    var $lazyImg = $('img[lazyload]');
    $.each($lazyImg, function(index, item){
        var $item = $(item);
        $item.addClass('img_hide');
        var src = $item.attr('lazyload');
        var img = document.createElement('img');
        img.onload = function() {
            item.src = src;
            $item.addClass('img_show').removeClass('img_hide').removeAttr('lazyload');
        };
        img.onerror= function() {
            console.log('img lazyload onerror');
        };
        img.src = src;
    });
});

//
$(function(){
    var $win = $(window),
        $doc = $(document),
        $body = $('body'),
        $hd = $('.detail_hd');
    if($hd.length){
        var $hd_bar = $('.detail_hd_info'),
            $hd_bar_clone = $hd_bar.clone(),
            hd_height,
            $slider_container = $hd.find('ul'),
            $slider_item = $slider_container.find('li'),
            slider_length = $slider_item.length,
            $slider_ctrl = $('.m-carousel-controls'),
            slider_current_index = 1,
            slider_timer;
        $hd_bar_clone.addClass('fixed');
        $hd_bar_clone.insertAfter($hd);
        $win.on('scroll', function(e){
            hd_height = $hd.height();
            if($body.scrollTop() > hd_height){
                $hd_bar.removeClass('wj_show').addClass('wj_hide');
            }else{
                $hd_bar.addClass('wj_show').removeClass('wj_hide');
            }
        });


        if($slider_container && slider_length>1){
            var $carousel = $('.m-carousel');
            var i = 0;
            for(i;i<slider_length;i++){
                $slider_ctrl.append('<a href="#" data-slide="'+(i+1)+'"></a>');
            }
            $carousel.carousel();
            $slider_ctrl.addClass('img_show');
            function slider_auto(){
                slider_current_index = slider_current_index > slider_length - 1 ? 1 : slider_current_index + 1;
                $carousel.carousel('move', slider_current_index);
                slider_timer = setTimeout(function(){
                    slider_auto();
                }, 3000);
            }
            setTimeout(function(){
                slider_auto();
            }, 3000);

            $carousel.on('afterSlide', function(previousIndex, newIndex){
                //console.log('prev::',previousIndex, 'new::',newIndex);
                slider_current_index = newIndex;
            });
        }
    }

    $('#wx_share,.wx_indicator').on('click', function(){
        $('.wx_indicator').toggle();
    });
});