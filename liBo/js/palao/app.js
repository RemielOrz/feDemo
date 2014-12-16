/*!
 * Created By remiel.
 * Date: 14-06-16
 * Time: 下午3:09
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
        img: window.OE&&OE.shareImg ? OE.shareImg : location.protocol+'//'+location.host + '/assets/images/palao/share_120x120.jpg',
        url: window.OE && OE.shareLink ? OE.shareLink : location.protocol+'//'+location.host+location.pathname+location.hash+location.search+'#',
        title: window.OE && OE.title? OE.title : OE.userName + '想送你去心动之旅双人免费游',
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
    $('.wx_share,.wx_indicator').on('click', function(){
        $('.wx_indicator').toggle();
    });

});

//页面相关
$(function(){

    var $hd = $('.hd'),
        $ani = $('.animated');

    var $hd = $('.hd'),
        titleList = $('.title');

    titleList.on('click', function(){
        var $this = $(this);
        $this.toggleClass('is-expanded');
    });

    //hd动画
    $hd
        .find('.j_hd_img')
        .lazyload(function(e){
//            if(e === 'onload'){
//                //加载成功之后执行动画
//                $ani
//                    .addClass(function(){
//                        return $(this).attr('animate-type')
//                    });
//            }
            //hd加载之后再载其他
            var $lazyImg = $('img[lazyload]');
            $lazyImg.lazyload();
        });
//
//    //提交表单
//    var $submit = $('.j_submit');
//    $submit.on('click', function(){
//        $(this).closest('form').submit();
//        $(this).off('click');
//    });

    //首页详情展开
    $('.off')
        .siblings('.detail_btn')
        .on('touchstart', function(){
        $(this)
            .siblings('.off')
            .removeClass('off')
            .addClass('on')
            .off('touchstart');
    });
});