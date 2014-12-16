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
$(function() {
    //分享
    var shareInfo = {
        img: 'http://weijing.qiniudn.com/share_draw_01_120x120.jpg',//http://weijing.qiniudn.com/common-logo120x120.png',
        url: location.protocol + '//' + location.host + location.pathname + location.hash + location.search + '#',
        title: "免费送 出国游。「清迈 帕劳 巴厘岛」双人免费",
        desc: "越早参加，抽奖号越多，中奖机会越多。小伙伴你也快来试试你的运气呀！"
    };
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "img_url": shareInfo.img,
                "link": shareInfo.url,
                "desc": shareInfo.desc,
                "title": shareInfo.title
            }, function (res) {});
        });
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": shareInfo.img,
                "link": shareInfo.url,
                "desc": shareInfo.desc,
                "title": shareInfo.title + ' | ' + shareInfo.desc
            }, function (res) {});
        });
    });
    //分享指引弹出层
    $('body').delegate('.wx_indicator, .js-show-indicator','touchstart', function () {
        $('.wx_indicator').toggle();
    });


    //页面相关
    var $list = $('.m-carousel-inner')
        , $item = $list.find('li')
        , item_length = $item.length
        , $carousel = $('.m-carousel')

        ,$home_info = $('.home_info')
        ,$home_time = $('.home_time')
        ,$home_count = $('.home_count')

        ,$roll = $('.roll-wrap')

        ,countdown
        ,$countdown = $('#countdown')

        ,base_url = "/restful/draw/"
        ,share_url

        ,$ft_inner = $('.ft_inner')
        ,$ft_btn = $ft_inner.find('.ft_btn')

        ,$msg_box = $('#msg_box')
        ,MsgBox, msgBox

        ,ids

        ,timer_turnout

        ,$rankings_table = $('.rankings_table')
        ,$my_info_title = $('.my_info_title')
        ,ladderDone

        ,$home_slider = $('.home_slider');

    //preload some img
    /*loadImg(
        $item.eq(0),
        loadImg(
            $item.eq(1),
            loadImg($item.eq(2))
        )
    );*/
    //auto load imgs
    loadQueue(0);

    function init(){

        //getIds
        ids = getIds();
        //getUserInfo
        getUserInfo(ids.draw_id);
        //参与人数
        timer_turnout = setTimeout(function(){
            getTurnout(ids.draw_id);
            timer_turnout = setTimeout(arguments.callee,5000);
        },1000);
        //getTurnout(ids.draw_id);
        //init element.  setTimeout to fix width bug
        setTimeout(function(){
            $home_info
                .height(initHeight(190))
                .addClass('wj_show');
        },1000);

        //init roll
        initRoll();
        //roll bind touch
        /*$roll
            .on('touchstart', function(){
                $roll.roll('stop');
            })
            .on('touchend', function(){
                $roll.roll('recover');
            });*/
        //initCountdown
        //initCountdown();
        //initCarousel
        initCarousel();
        //$carousel.carousel('move',2);

        //init msgBox
        msgBox = new MsgBox();


        //ani
        $home_slider.addClass('animated infinite home_slider_ani');
    }

    function initCountdown(timestamp){
        //countdown
        var deadline = new Date(2014,8,2,16,0,0);
        deadline = deadline < timestamp ? new Date(2014,8, 9,16,0,0) : deadline;
        deadline = deadline < timestamp ? new Date(2014,8,19,16,0,0) : deadline;
        //deadline = deadline < timestamp ? new Date(2014,8,29,16,0,0) : deadline;
        countdown = new OE.Countdown(deadline, timestamp);
        countdown.tick(function(d,h,m,s){
            //$countdown.html(d+"天"+h+"小时"+m+"分");
            $countdown.html(d+"天"+h+"小时"+m+"分"+s+"秒");
            //$countdown.html(h+"小时"+m+"分"+s+"秒");
        });
        $('#home_date').html("距离" + (deadline.getMonth()+1) + "·" + deadline.getDate() + "开奖还有:");
    }

    function initRoll(){
        //init roll
        $roll.roll(
            {
                infinite: true, // 是否循环
                speed: 0.50, // 每帧移动多少像素
                direction: 'y', // 移动的方向，只支持 'x' 和 'y'
                start: 1
            }
        );
        $roll.roll('stop');
    }

    function initCarousel(){
        //init carousel
        $carousel
            .carousel({
                axis: 'X',
                duration:.4,
                dragging: 1,
                scaled: 1
            })
            .on('beforeSlide', function(e, previousIndex, newIndex){
                console.log('beforeSlide');

                //loadImg($item.eq(newIndex-1));
                clearTimeout(timer_turnout);

                if(newIndex == item_length - 1){
                    getLadder(ids.draw_id);
                }
            })
            .on('afterSlide', function(e, previousIndex, newIndex){
                console.log('afterSlide');

                if(newIndex+1 < item_length){
                    loadImg($item.eq(newIndex+2));
                }

                //roll
                if(newIndex == item_length - 1){
                    $roll.roll('reset');
                }else{
                    $roll.roll('stop');
                }

                //update总人数
                if(newIndex == 1){
                    timer_turnout = setTimeout(function(){
                        getTurnout(ids.draw_id);
                        timer_turnout = setTimeout(arguments.callee,5000);
                    },1000);
                }

            });
    }

    //获取draw_id和src_id
    function getIds(){
        var path = location.pathname
            ,search = location.search
            ,draw_id = path.replace(base_url, '')
            ,src_id;
        search
            .replace('?','')
            .split('&')
            .forEach(function(v,i){
                var tmp = v.split('=');
                if(tmp[0] === 'src') src_id = tmp[1];
            });
        return {draw_id: draw_id, src_id: src_id}
    }

    //获取排行榜数据
    function getLadder(draw_id){
        var url = base_url + draw_id + '/ladder';
        if(ladderDone) return false;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 3000,
            cache: false,
            success: function(d){
                console.log(d);
                ladderInit = 1;
                var html = [];
                if(d.ladder && d.ladder.length){
                    html.push("<tr><td>排名</td><td>昵称</td><td>抽奖号个数</td></tr>");
                    $.each(d.ladder, function(i,v){
                        if (v.nickname && v.nickname.length > 1){
                            var stringArray = v.nickname.split("");
                            stringArray.splice(1,1,"*");
                            v.nickname = stringArray.join("");
                        }else{
                            v.nickname = "*";
                        }
                        html.push("<tr><td>"+(i+1)+"</td><td>"+ v.nickname +"</td><td>"+ v.score +"</td></tr>");
                    });
                    html.push("<tr><td>...</td><td>...</td><td>...</td></tr>");
                    if (d.the100th){
                        if(d.the100th.nickname > 1){
                            var stringArray = d.the100th.nickname.split("");
                            stringArray.splice(1,1,"*");
                            d.the100th.nickname = stringArray.join("");
                        }else{
                            d.the100th.nickname = "*";
                        }
                        html.push("<tr><td>"+100+"</td><td>"+ (d.the100th ? d.the100th.nickname : "") +"</td><td>"+ (d.the100th ? d.the100th.score : "") +"</td></tr>");
                    }
                    $rankings_table.html(html.join(""));
                }
                d.mine && $my_info_title.find('span').html(d.mine.score);
            },
            error: function(xhr, type){
                console.log(xhr, type);
                //alert('提交出错了');
                /*msgBox
                    .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                    .show();*/
            }
        });
    }

    //获取用户信息 初始化页面
    function getUserInfo(draw_id){
        var url = base_url + draw_id + '/user';

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 3000,
            cache: false,
            success: function(d){
                console.log(d);
                switch (d.id){
                    case "user_joined":
                        if(d.info.paused){
                            //alert('活动暂停');
                            msgBox
                                .setContent("","稍安勿躁！因正在紧张地计算本轮中奖结果，所以活动正处于暂停阶段。中奖结果出炉即刻恢复活动，请密切关注活动进展哦~")
                                .show();
                        }else{
                            if(d.info.share_url) share_url = shareInfo.url = d.info.share_url;
                            $ft_btn
                                .html('邀请朋友')
                                .addClass('js-show-indicator');
                            $ft_inner.addClass('wj_show');
                        }
                        //initCountdown
                        d.info.timestamp && initCountdown(d.info.timestamp * 1000);
                        break;
                    case "user_not_joined":
                        if(d.info.paused){
                            //alert('活动暂停');
                            msgBox
                                .setContent("","稍安勿躁！因正在紧张地计算本轮中奖结果，所以活动正处于暂停阶段。中奖结果出炉即刻恢复活动，请密切关注活动进展哦~")
                                .show();
                        }else{
                            $ft_btn
                                .html('我要抽奖')
                                .on('touchstart.join', function(){
                                    join(ids.draw_id, ids.src_id);
                                    $(this)
                                        .off('touchstart.join')
                                        .on('touchstart.msg', function(){
                                            msgBox
                                                .setContent("","系统正在处理，请勿重复提交!")
                                                .show();
                                        });
                                });
                            $ft_inner.addClass('wj_show');
                        }
                        //initCountdown
                        d.info.timestamp && initCountdown(d.info.timestamp * 1000);
                        break;
                    case "has_error":
                        //alert("has_error: " + d.info.message);
                        msgBox
                            .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                            .show();
                        break;
                    default: console.log(d);
                }
            },
            error: function(xhr, type){
                console.log(xhr, type);
                //alert('提交出错了');
                msgBox
                    .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                    .show();
            }
        });
    }

    //参加活动
    function join(draw_id, src_id){
        var url = base_url + draw_id + "/create";
        if(src_id) url += "?src=" + src_id;

        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            timeout: 3000,
            cache: false,
            success: function(d){
                console.log(d);
                $ft_btn
                    .off('touchstart.msg');
                switch (d.id){
                    case "joined_success":
                        if(d.info.share_url) share_url = shareInfo.url = d.info.share_url;
                        //alert("抽奖号:" + d.info.ticket)
                        msgBox
                            .setContent("参与成功","恭喜你！已成功拿下一个抽奖号："+ d.info.ticket +"<br>再努力一下！分享活动给朋友或到朋友圈，不但多得抽奖号；如果好友中了奖，你也一起去哦~")
                            .show();
                        $ft_btn
                            .html('邀请朋友')
                            .addClass('js-show-indicator');
                        break;
                    case "not_followed":
                        //alert("未关注, 一键关注:"+ d.info.redirect_url);
                        msgBox
                            .setContent("温馨提示","活动由「微景旅游」开奖，赶快关注它，去查看抽奖号坐等开奖！不抓住这免费出国游的中奖机会，人生后悔哟~3秒钟后自动跳转~","去关注等开奖",d.info.redirect_url)
                            .show();
                        setTimeout(function(){
                            location.href = d.info.redirect_url;
                        },3000);
                        break;
                    case "draw_paused":
                        //alert("活动暂停");
                        msgBox
                            .setContent("","稍安勿躁！因正在紧张地计算本轮中奖结果，所以活动正处于暂停阶段。中奖结果出炉即刻恢复活动，请密切关注活动进展哦~")
                            .show();
                        break;
                    case "has_error":
                        //alert("has_error: " + d.info.message);
                        msgBox
                            .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                            .show();
                        break;
                    default: console.log(d);
                }
            },
            error: function(xhr, type){
                console.log(xhr, type);
                //alert('初始化出错');
                msgBox
                    .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                    .show();
            }
        });
    }

    //获取参与人数
    function getTurnout(draw_id){
        var url = base_url + draw_id + "/turnout";
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 5000,
            cache: false,
            success: function(d){
                console.log(d);
                switch (d.id){
                    case "turnout":
                        //d.info.cnt
                        $home_count.find('span').html(d.info.cnt + '人');
                        break;
                    default: console.log(d);
                }
            },
            error: function(xhr, type){
                console.log(xhr, type);
                //alert('获取人数出错');
                /*msgBox
                    .setContent("","当前网络拥堵，不急一时请稍后刷新页面重试，距离开奖还有时间呢。")
                    .show();*/
            }
        });
    }

    //提示框
    MsgBox = function (){
        this.init();
    };
    MsgBox.prototype.init = function(){
        this
            .initElement()
            .bind();
    };
    MsgBox.prototype.initElement = function(){
        this.$el = $('#msg_box');
        this.$title = this.$el.find('.popup_hd');
        this.$content = this.$el.find('.popup_bd');
        this.$btn = this.$el.find('.popup_btn');
        return this;
    };
    MsgBox.prototype.setContent = function (title,content,btnText,url){
        this.$title.html(title);
        this.$content.html(content);
        this.$btn.html(btnText?btnText:'确 定');
        if(url){
            this.$btn.attr('href',url);
        }else{
            this.$btn.attr('href','javascript:;');
        }
        return this;
    };
    MsgBox.prototype.show = function(){
        this.$el.show();
        return this;
    };
    MsgBox.prototype.hide = function(){
        this.$el.hide();
        return this;
    };
    MsgBox.prototype.bind = function(){
        var self = this;
        this.$btn.on('touchstart', function(){
            self.hide();
        });
        return this;
    };

    function initHeight(h){
        return h/640*window.innerWidth+'px';
    }

    function loadImg(el, callback){
        el.find('img[lazyload]').lazyload(function(){
            typeof callback === 'function' && callback.call(this);
        });
    }

    function loadQueue(i){
        loadImg($item.eq(i),function(){
            i++;
            if(i >=$item.length-1) return false;
            loadQueue(i);
        })
    }

    $(document).on('touchstart touchmove touchend click mousemove moueseup mousedown', function(e){
        e.preventDefault();
    });


    //执行init
    init();
});

