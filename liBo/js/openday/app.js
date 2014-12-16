/*!
 * Created By remiel.
 * Date: 14-06-10
 * Time: 下午3:09
 */

//
var m = 2;
if($(window).width()>=540){
    m = 2/(24/16);
}

//
$(function(){
    if(!window.OE){
        window.OE = {};
    }
    //分享
    var shareInfo = {
        img: OE.img ? OE.img : 'http://weijing.3dyou.cn/assets/images/common/logo120x120.png',
        url: location.protocol+'//'+location.host+location.pathname+location.hash+location.search+'#',
        title: OE.title ? OE.title : '微景旅游',
        desc: OE.content ? OE.content : '百万门票红包大派送，先到先得喔！'
    };
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            if(OE.createBeforeShare){
                $.post('/openday/'+ OE.shareId +'/share/create', function(data){
                    console.log(data);
                    if(data.ok == true){
                        WeixinJSBridge.invoke('sendAppMessage',{
                            "img_url":shareInfo.img,
                            "link":data.msg,
                            "desc":shareInfo.desc,
                            "title":shareInfo.title
                        }, function(res){});
                    }
                });
            }else{
                WeixinJSBridge.invoke('sendAppMessage',{
                    "img_url":shareInfo.img,
                    "link":shareInfo.url,
                    "desc":shareInfo.desc,
                    "title":shareInfo.title
                }, function(res){});
            }
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            if(OE.createBeforeShare) {
                $.post('/openday/'+ OE.shareId +'/share/create', function(data){
                    console.log(data);
                    if(data.ok == true){
                        WeixinJSBridge.invoke('shareTimeline',{
                            "img_url":shareInfo.img,
                            "link":data.msg,
                            "desc":shareInfo.desc,
                            "title":shareInfo.title + '|' + shareInfo.desc
                        }, function(res){});
                    }
                });
            }else{
                WeixinJSBridge.invoke('sendAppMessage',{
                    "img_url":shareInfo.img,
                    "link":shareInfo.url,
                    "desc":shareInfo.desc,
                    "title":shareInfo.title
                }, function(res){});
            }
        });
    });
    //分享指引弹出层
    $('.wx_share,.wx_indicator').on('click', function(){
        $('.wx_indicator').toggle();
    });


    //兑换
    if($('.op_scenic_detail').length){
        $('.op_ticket_btn').on('click', function(){
            var _this = $(this);
            _this.closest('form').submit();
        });
    }

    //js提交表单
    $('.j_submit').on('click', function(){
        var _this = $(this);
        _this.closest('form').submit();
    });

});

$(function(){

    var $op_ticket = $('.op_ticket');

    if($op_ticket.length){

        drawEdge_01('bottom');
        drawEdge_01('top');
        drawLogo($op_ticket,'op_ticket_logo');

        /*$('.op_ticket_img').find('img').onload(function(){

        });*/

    }

    var $op_ticket_list = $('.op_ticket_list').eq(0);
    var $op_ticket_list_item = $op_ticket_list.find('.op_ticket_list_item');
    if($op_ticket_list_item.length && $op_ticket_list.attr('draw') != 1){
        $.each($op_ticket_list_item, function(i,item){
            var $item = $(item);
            drawEdge_02($item);
            drawLogo($item,'op_ticket_list_logo');
        });
        $op_ticket_list.attr('draw',1);
    }



    //tab
    /*var $tab = $('.mod_tab').find('.box_flex_inner'),
        $container = $('.mod_tab_container');
    $tab.on('touchstart', function(){
        $tab.removeClass('active');
        var i = $(this).addClass('active').index();
        $container
            .hide()
            .eq(i).show();

        var $op_ticket_list = $container.eq(i);
        var $op_ticket_list_item = $op_ticket_list.find('.op_ticket_list_item');
        if($op_ticket_list_item.length && $op_ticket_list.attr('draw') != 1) {
            $.each($op_ticket_list_item, function (i, item) {
                var $item = $(item);
                drawEdge_02($item);
                drawLogo($item, 'op_ticket_list_logo');
            });
            $op_ticket_list.attr('draw',1);
        }
    });*/


    function drawEdge_01(type){
        var canvas = document.createElement('canvas'),
            $canvas = $(canvas);
        $canvas
            .attr('height','4')
            .attr('width', $op_ticket.width());

        $canvas
            .addClass('op_ticket_' + type)
            .insertBefore('.op_ticket_hd');

        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        if(type == 'top'){
            ctx.moveTo(0,$canvas.height());
            ctx.lineTo(0,1);
        }else{
            ctx.moveTo(0,0);
            ctx.lineTo(0,1);
        }
        for(var i = 0;i<=$canvas.width(); i++){
            ctx.lineTo(i,2+Math.cos( i/13*2*m/1.2*Math.PI ));
        }
        if(type == 'top'){
            ctx.lineTo($canvas.width(), $canvas.height());
            ctx.lineTo(0,$canvas.height());
        }else{
            ctx.lineTo($canvas.width(), 0);
            ctx.lineTo(0,0);
        }
        ctx.closePath();

        ctx.fillStyle = "#ffc81f";
        ctx.fill();
    }
    function drawEdge_02(el){
        var $el = $(el),
            el_h = $el.height(),
            el_w = $el.width();
        if($el.attr('draw') == 1) return false;
        var canvas = document.createElement('canvas'),
            $canvas = $(canvas);
        $canvas
            .attr('height', el_h)
            .attr('width', el_w+1);

        $canvas
            .addClass('op_ticket_list_canvas')
            .appendTo($el);

        var ctx = canvas.getContext('2d');

        for(var i = 0;i<=el_h/(38/m); i++){
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(0,(i*36+18+10)/m,10/m,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(el_w,(i*36+18+10)/m,10/m,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        $el.attr('draw',1);

    }
    function drawLogo(el, cls){

        var $el = $(el),
            el_h = $el.height(),
            el_w = $el.width();

        var canvas = document.createElement('canvas'),
            $canvas = $(canvas);
        $canvas
            .attr('height', 80/m)
            .attr('width', 160/m);

        $canvas
            .addClass(cls)
            .appendTo($el);

        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(0, 68/m);
        ctx.lineTo(72/m, 58/m);
        ctx.lineTo(144/m, 68/m);
        ctx.lineTo(144/m, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();


        ctx.shadowColor = "rgba(0,0,0,.4)";
        ctx.shadowOffsetX = 4/m;
        ctx.shadowOffsetY = 4/m;
        //ctx.shadowBlur = 10;

        ctx.fillStyle = "#67d7cb";
        ctx.fill();


        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.moveTo(144/m,0);
        ctx.lineTo(144/m, 8/m);
        ctx.lineTo(150/m, 8/m);
        ctx.lineTo(144/m, 0);

        ctx.fillStyle = "#484848";
        ctx.fill();

    }

});

//弹出框
$(function(){

    var $op_window = $('.op_window');
    if($op_window.length){

        function drawWindow(el){
            var $el = $(el),
                h = $el.height(),
                w = $el.width();
            if($el.attr('draw') == 1) return false;
            var canvas = document.createElement('canvas'),
                $canvas = $(canvas);
            $canvas
                .attr('height', h)
                .attr('width', w);

            $canvas
                .addClass('')
                .appendTo(el);

            var ctx = canvas.getContext('2d');

            //白色
            ctx.beginPath();

            ctx.moveTo(0,0);
            ctx.lineTo(w-46/m,0);
            ctx.arc(w-14/m,20/m,36/m,(360-150)/180*Math.PI,64.2/180*Math.PI,1);
            ctx.lineTo(w,50/m);
            ctx.lineTo(w,h);
            ctx.lineTo(0,h);
            ctx.lineTo(0,0);

            ctx.closePath();

            ctx.fillStyle = "#fff";//67d7cb
            ctx.fill();
            //ctx.stroke();

            //绿色
            ctx.beginPath();

            ctx.moveTo(10/m,10/m);
            ctx.lineTo(w-56/m-m,10/m);
            ctx.arc(w-24/m+8.5/m,30/m-8.5/m,46/m,(360-164)/180*Math.PI,86/180*Math.PI,1);
            ctx.lineTo(w-10/m,60/m+2+2);
            ctx.lineTo(w-10/m,h-10/m);
            ctx.lineTo(10/m,h-10/m);
            ctx.lineTo(10/m,10/m);

            ctx.closePath();

            ctx.fillStyle = "#67d7cb";//
            ctx.fill();
            //    ctx.stroke()

            //
            $el.attr('draw',1);
            //console.log('画完咯....');
        }
    }

    $('.op_ticket_btn').on('click', function(){
        var $el,
            $this = $(this),
            $coin = $('.op_coin_count').find('span'),
            coin = $coin.text()*1,
            $table = $this.closest('.op_ticket_table'),
            $remain = $table.find('.op_ticket_count'),
            remain = $remain.text()*1,
            $cost = $table.find('.op_ticket_cost'),
            cost = $cost.text()* 1,
            url = $this.attr('url');
        if(remain){
            /*$.post(url, function(data, status, xhr){
                console.log(data);
                console.log(status);
                console.log(xhr);
                if(data.ok){
                    $el = $('.j_window_success').show().find('.op_window_bg');
                    drawWindow($el);
                    $remain.text(remain-1);
                    $coin.text(coin-cost);
                }else{
                    $el = $('.j_window_error').show().find('.op_window_bg');
                    drawWindow($el);
                }
            });*/

            var $j_window_acquire_ticket = $('.j_window_acquire_ticket'),
                $acquire_ticket_btn = $j_window_acquire_ticket.find('.op_window_btn_01');
            drawWindow($j_window_acquire_ticket.show().find('.op_window_bg'));

            $acquire_ticket_btn.on('click', function(){
                $.ajax({
                    type: 'POST',
                    url: url,
                    success: function (data) {
                        console.log(data);
                        if(data.ok){
                            $el = $('.j_window_success').show().find('.op_window_bg');
                            drawWindow($el);
                            $remain.text(remain-1);
                            $coin.text(coin-cost);
                        }else{
                            console.log('data ok not true');
                            var $box = $('.j_window_error');
                            $box.find('.op_window_title').html(data.msg);
                            $el = $box.show().find('.op_window_bg');
                            drawWindow($el);
                        }
                    },
                    error: function(xhr, type){
                        console.log(xhr.response);
                        console.log(type);
                        var data = JSON.parse(xhr.response);
                        var $box = $('.j_window_error');
                        $box.find('.op_window_title').html(data.msg);
                        $el = $box.show().find('.op_window_bg');
                        drawWindow($el);
                    }
                });
            });
        }else{
            $el = $('.j_window_normal').show().find('.op_window_bg');
            drawWindow($el);
        }
    });

    $('.op_window_close, .j_close_window').on('click', function(){
        $(this).closest('.mask').hide();
    });


    //j_window_normal
    $('.j_open_window').on('click', function(){
        var $el = $('.j_window_normal').show().find('.op_window_bg');
        drawWindow($el);
    });

});