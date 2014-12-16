/*!
 * Created By remiel.
 * Date: 14-8-8
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

$(function(){

    var share_url;

    //分享
    shareInfo = {
        img: 'http://weijing.qiniudn.com/opendayFun_share120x120.jpg',//'http://weijing.qiniudn.com/common-logo120x120.png',
        url: location.protocol+'//'+location.host+location.pathname+location.hash+location.search+'#',
        title: '好玩广东·门票免费，一起出发好不？',
        desc: '微景旅游豪送10万张门票，让您百分百免费玩景区。先到先得，赶快来吧！'
    };
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            if(window.joined){
                if(share_url){
                    sendAppMessage();
                }else{
                    getShareUrl(sendAppMessage);
                }
            }else{
                sendAppMessage();
            }
            function sendAppMessage(){
                WeixinJSBridge.invoke('sendAppMessage',{
                    "img_url":shareInfo.img,
                    "link":shareInfo.url,
                    "desc":shareInfo.desc,
                    "title":shareInfo.title
                }, function(res){(conf.callback)();});
            }
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            if(window.joined){
                if(share_url){
                    shareTimeline();
                }else{
                    getShareUrl(shareTimeline);
                }
            }else{
                shareTimeline();
            }
            function shareTimeline(){
                WeixinJSBridge.invoke('shareTimeline',{
                    "img_url":shareInfo.img,
                    "link":shareInfo.url,
                    "desc":shareInfo.desc,
                    "title":shareInfo.desc
                }, function(res){});
            }
        });
    });
    //分享指引弹出层
    $('.wx_indicator, .js-show-indicator').on('touchstart', function(){
        $('.wx_indicator').toggle();
    });


    var $list = $('.m-carousel-inner'),
        $item = $list.find('li'),
        $exchange_btn = $('.exchange_btn'),
        $ticket_btn = $('.ticket_btn'),
        $share_btn = $('.share_btn'),
        $carousel = $('.m-carousel'),
        $instruction = $('.instruction'),
        $roll_wrap = $('.roll_wrap'),
        $roll = $('.roll-wrap'),
        $home_loading = $('.home_loading'),
        $home_loading_bar = $('.home_loading_bar'),
        $counter = $('.counter'),
        $msg_box = $('#msg_box');

    $exchange_btn.addClass('wj_hide');

    $counter.find('span').html(window.SumOfVoucher);
    $roll_wrap.find('.roll_inner').html(window.newestList);

    setTimeout(function(){
        $home_loading_bar.css({'right': '10%'});
    },100);

    $.each($item, function(i,v){
        $(v).css('z-index',$item.length - i);
    });
    $item.addClass('op_1');
    //$item.slice(0,3).addClass('op_1');
    //$('img[lazyload]').lazyload();
    //loadImg($item.eq(0), loadQueue(1));
    loadImg($item.eq(0), function(e){
        if(e === 'onerror'){
            loadImg($item.eq(0));
        }
        $home_loading_bar.addClass('done').css({'right': '0%'});
        $home_loading.addClass('done');
        setTimeout(function(){
            $home_loading.remove();
        },1000);
        loadImg($item.eq(1), loadImg($item.eq(2)));
        setTimeout(function(){
            hideInstruction();
        },6000);

        if(window.joined){
            $ticket_btn.remove();
            $('.instruction_02').remove();
            $share_btn.addClass('share_btn_show');
        }

    });
    $carousel
        .on('touchstart', function(e){
            $ticket_btn.addClass('ticket_btn_hide');
        })
        .carousel()
        .on('beforeSlide', function(e, previousIndex, newIndex){
            loadImg($item.eq(newIndex-1));
            $exchange_btn.removeClass('wj_show');
            if(newIndex == 1) {
                $ticket_btn.removeClass('ticket_btn_hide');
                $roll.roll('recover');
            }else{
                $roll.roll('stop');
            }
        })
        .on('afterSlide', function(e, previousIndex, newIndex){
            if(newIndex+1 < $item.length){
                loadImg($item.eq(newIndex+1));
                loadImg($item.eq(newIndex+2));
            }
            var $current = $('.m-active');
            $item
                .not('.m-active')
                .find('.exchange_btn,h1,.content')
                .removeClass('wj_show');
            $current
                .find('.exchange_btn,h1,.content')
                .addClass('wj_show');
            /*$item
                .removeClass('op_1')
                .slice(newIndex==1?(newIndex-1):(newIndex-2),(newIndex+1))
                .addClass('op_1');*/
        });

    $ticket_btn.on('touchstart', function(e){
        if($ticket_btn.hasClass('ticket_btn_hide')){
            $ticket_btn.removeClass('ticket_btn_hide');
        }else{
            //ajax
            var param = {};
            if(window.viral_id){param.viral_id = window.viral_id}
            if(window.source_id){param.source_id = window.source_id}
            param = JSON.stringify(param);

            $ticket_btn.addClass('wj_show');
            $.ajax({
                type: 'POST',
                url: window.ajaxUrl,
                data: param,
                contentType: 'application/json',
                success: function(data){
                    console.log(data);

                    if(data.ok == true){
                        window.joined = true;
                        $msg_box.show();

                        $ticket_btn.remove();
                        $share_btn.addClass('share_btn_show');

                        if(data.redirect) window.location = data.redirect;
                    }
                },
                error: function(xhr, type){}
            })
        }
    });

    $instruction.on('touchstart', function(e){
        e.preventDefault();
        hideInstruction();
    });

    $msg_box.find('.popup_btn').on('touchstart', function(e){
        $msg_box.toggle();
    });

    $share_btn.on('touchstart', function(){
        if(!share_url){
            getShareUrl();
        }
    });

    function loadImg(el, callback){
        el.find('img[lazyload]').lazyload(function(e){
            typeof callback === 'function' && callback.call(this, e);
        });
    }

    function getShareUrl(callback){

        var param = {};
        if(window.viral_id){param.viral_id = window.viral_id}
        if(window.source_id){param.source_id = window.source_id}
        param = JSON.stringify(param);

        $.ajax({
            type: 'POST',
            url: window.ajaxUrl,
            data: param,
            contentType: 'application/json',
            success: function(data){
                console.log(data);

                if(data.ok == true){
                    //$msg_box.show();

                    //$ticket_btn.remove();
                    //$share_btn.addClass('share_btn_show');

                    if(data.redirect) window.location = data.redirect;

                }
                if(data.share_url){
                    share_url = shareInfo.url =data.share_url;
                }

                typeof callback === "function" && callback.call(this, 'success');
            },
            error: function(xhr, type){
                console.log('error:: ',xhr);
                typeof callback === "function" && callback.call(this, 'error');
            }
        })
    }

    function hideInstruction(){
        var win_w = $(window).width();
        $instruction.addClass('wj_hide');
        $('.home_04,.home_03').addClass('wj_show');
        $('.home_05,.home_06').addClass('bounceInDown wj_show');
        $counter.addClass('flipInX wj_show');
        $('.home_04')
            .css({
                'top': 104/2/320*win_w+'px',
                'width': 310/2/320*win_w+'px',
                'height': 308/2/320*win_w+'px'
            });
        $('.ico_07')
            .css({
                'top': 680/2/320*win_w+'px'
                //,'width': 120/2/320*win_w+'px'
                //,'height': 94/2/320*win_w+'px'
            })
            .addClass('animate_slide');
        $roll_wrap
            .css({
                'top': 310/320*$item.eq(0).width()+'px'
            })
            .addClass('rollIn');
        $roll.roll(
            {
                infinite: true, // 是否循环
                speed: 1, // 每帧移动多少像素
                direction: 'x' // 移动的方向，只支持 'x' 和 'y'
            }
        );
    }


    $('.info a').on('touchstart', function(e){
        window.location = $(this).attr('href');
    });

    /*function loadQueue(i){
        loadImg($item.eq(i),function(){
            i++;
            if(i >=$item.length) return false;
            loadQueue(i);
        })
    }*/
});

