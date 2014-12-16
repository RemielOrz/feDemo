/*!
 * Created By remiel.
 * Date: 14-04-21
 * Time: 下午3:09
 */
$.fn.lazyload = function(){
    return this.each(function(index, item){
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
};

//
$(function(){
    //lazyload
    var $lazyImg = $('img[lazyload]');
    $lazyImg.lazyload();
    //
    var $win = $(window),
        $doc = $(document),
        $body = $('body'),
        $hd = $('.detail_hd');
    if($hd.length){
        $hd.width($win.width());
        var $hd_bar = $('.detail_hd_info'),
            $hd_bar_clone = $hd_bar.clone(),
            hd_height,
            $slider_container = $hd.find('ul'),
            $slider_item = $slider_container.find('li'),
            slider_length = $slider_item.length,
            $slider_ctrl = $('.m-carousel-controls'),
            slider_current_index = 1,
            slider_timer,
            $join = $('#join');
        $hd_bar_clone.addClass('fixed');
        $hd_bar_clone.addClass('wj_hide').insertAfter($hd);
        $win.on('scroll', function(e){
            hd_height = $hd.height();
            if($body.scrollTop() > hd_height){
                $hd_bar.removeClass('wj_show').addClass('wj_hide');
                $hd_bar_clone.addClass('wj_show').removeClass('wj_hide');
            }else{
                $hd_bar.addClass('wj_show').removeClass('wj_hide');
                $hd_bar_clone.removeClass('wj_show').addClass('wj_hide');
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
                clearTimeout(slider_timer);
                slider_timer = setTimeout(function(){
                    slider_auto();
                }, 3000);
            }
            slider_timer = setTimeout(function(){
                slider_auto();
            }, 3000);

            $carousel.on('afterSlide', function(previousIndex, newIndex){
                //console.log('prev::',previousIndex, 'new::',newIndex);
                slider_current_index = newIndex;
            });

            $body.
                on('touchstart', function(e){
                    console.log(e.type);
                    clearTimeout(slider_timer);
                }).
                on('touchmove', function(e){
                    console.log(e.type);
                }).
                on('touchend', function(e){
                    console.log(e.type);
                    clearTimeout(slider_timer);
                    slider_timer = setTimeout(function(){
                        slider_auto();
                    }, 3000);
                });
        }

        $join.on('click', function(){
            var _this = $(this),
                $span = _this.find('span');
            if(!_this.hasClass('disabled')){
                $.post(location.pathname + 'join', function(){
                    $span.html(parseInt($span.html(), 10) + 1);
                });
            }
            _this.off('click');
        });

    }

    $('#wx_share,.wx_indicator').on('click', function(){
        $('.wx_indicator').toggle();
    });
});

//定位 附近列表页面
$(function(){

    var ls,timestamp;
    if( window.localStorage && window.localStorage.getItem){
        ls = localStorage;
        timestamp = (new Date()).valueOf();
    }

    var $list = $('#qunar_list');
    var $container = $('.qunar_list_container');
    var $tab = $('.mod_tab_01').find('.box_flex_inner');
    var $loading = $('.loading');
    if($list.length){

        $tab.on('touchstart', function(){
            $tab.removeClass('active');
            var i = $(this).addClass('active').index();
            $container
                .hide()
                .eq(i).show();
        });

        function sub(str,data) {
            return str
                .replace(/{(.*?)}/igm,function($,$1) {
                    return data[$1]?data[$1]:(data[$1]===0?0:'');
                });
        }

        var tpl = [
            '<a class="list_item link_box img_placeholder" href="{link}">',
            '<img src="/assets/images/qunar/placeholder640x380@2x.png" lazyload="{image}" alt="loading..."/>',
            '<div class="list_item_tag_container">',
            '<div class="list_item_join fr">{attendCount}</div>',
            '<div class="list_item_distance fr" distance="{distance}">{distance}km</div>',
            '</div>',
            '<div class="list_item_info">',
            '<div class="list_item_title">{title}</div>',
            '<div class="list_item_place">{address}</div>',
            '</div>',
            '</a>'
        ].join('');

        if(ls && ls.longitude && ls.latitude && (timestamp - ls.geoTimestamp/1000) < 24*60*60*1000){
            console.log('get GeoInfo from localStorage',ls.longitude, ls.latitude, ls.geoTimestamp);
            getGeolocation_success(ls.longitude, ls.latitude);
        }else if(navigator.geolocation){
            console.log('get GeoInfo from navigator.geolocation');
            navigator.geolocation.getCurrentPosition(
                function(pos){
                    console.log('定位成功:',pos,pos.coords.longitude,pos.coords.latitude,pos.timestamp);
                    if(ls){
                        localStorage.setItem('longitude', pos.coords.longitude);
                        localStorage.setItem('latitude', pos.coords.latitude);
                        localStorage.setItem('geoTimestamp', pos.timestamp);
                    }
                    getGeolocation_success(pos.coords.longitude, pos.coords.latitude);
                },
                function(error){
                    getGeolocation_error();
                    switch(error.code)
                    {
                        case error.PERMISSION_DENIED:
                            console.log("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.log("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            console.log("An unknown error occurred.");
                            break;
                    }
                },
                {maximumAge:600000, timeout:8000}
            );
        }else{
            console.log('不定位|不支持定位|没有本地存储');
            getGeolocation_error();
        }

        function setContent(json, container){
            var html = '';
            $.each(json, function(i, v){
                html+= sub(tpl, v);
            });

            var $html = $(html);
            $html
                .find('[distance="0"]')
                .hide();
            container.append($html);
            $list
                //.append($html)
                .addClass('wj_show');

            var $lazyImg = $('img[lazyload]');
            $lazyImg.lazyload();
        }
        function getGeolocation_success(longitude, latitude){
            console.log('getGeolocation_success', longitude, latitude);
            $loading.hide();
            $.getJSON('/qunaer/fair/hot?lat='+latitude+'&lng='+longitude, function(json){
                console.log(json);
                setContent(json, $container.eq(0));
            });

            $.getJSON('/qunaer/fair/api/nearby?lat='+latitude+'&lng='+longitude,function(json){
                console.log(json);
                setContent(json, $container.eq(1));
            });

        }
        function getGeolocation_error(){
            /*var $city_list = $('#city_list');
            $city_list.show();
            $loading.hide();*/
            getGeolocation_success(0, 0);
        }

    }

});