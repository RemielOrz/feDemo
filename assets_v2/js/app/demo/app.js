/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */

require.config({
    //enforceDefine: true,
    baseUrl: location.port === "3000" ? "../js/app/" : "./assets/js/app/",
    paths: {
        "_":"../dest/lib/underscore/underscore.min",
        "$":"../dest/lib/zepto.min",
        "lazyload":"../dest/lazyload/zepto.lazyload",
        "carousel": "../dest/carousel/carousel",
        "Swipe": "../dest/swipe/swipe",
        "WeixinApi": "../module/WeixinApi/WeixinApi",


        "OE": "../dest/OE",
        "Calendar": "../dest/calendar/calendar",
        "MsgBox": "../dest/msgBox/msgBox",
        "Menu": "../dest/menu/menu",
        "DropBox": "../dest/dropBox/dropBox",
        "ITouchMove": "../dest/iTouchMove/iTouchMove",
        "Modifier": "../dest/modifier/modifier",
        "TabSelection": "../dest/tabSelection/tabSelection",
        "AsideWindow": "../dest/asideWindow/asideWindow",
        "Loading": "../dest/loading/loading",

        "trip":"../dest/app/trip/trip",
        "tripDaily":"../dest/app/trip/tripDaily",
        "order":"../dest/app/order/order",
        "orderDetail":"../dest/app/order/orderDetail",
        "orderList":"../dest/app/order/orderList"
    },
    shim: {
        "$": {
            exports: "$"
        },
        "_": {
            exports: "_"
        },
        "lazyload": ["$"],
        "Swipe": {
            deps: ["$"],
            exports: "Swipe"
        },
        "WeixinApi":{
            exports: "WeixinApi"
        }

    }
});
//
require(["OE","Menu","Loading","WeixinApi"],function(OE,Menu,Loading,WeixinApi){
    OE.log('[app init]');
    var $ = OE.$;
    var u = OE.utils;

    OE.BASE_URL = location.port === "3000" ? "" : "./assets";
    OE.log('[WeixinApi.version]:' + WeixinApi.version);
    OE.log('[WeixinApi.openInWeixin]:' + WeixinApi.openInWeixin());
    // 开发阶段，开启WeixinApi的调试模式
    WeixinApi.enableDebugMode();
    // 初始化WeixinApi，等待分享
    WeixinApi.ready(function(Api) {

        // 微信分享的数据
        var wxData = {
            "appId": '', // 服务号可以填写appId
            "imgUrl" : '',
            "link" : 'http://www.baidu.com',
            "desc" : '12',
            "title" : '3'
        };

        // 分享的回调
        var wxCallbacks = {
            // 分享操作开始之前
            ready : function() {
                // 你可以在这里对分享的数据进行重组
                alert("准备分享");
            },
            // 分享被用户自动取消
            cancel : function(resp) {
                // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
                alert("分享被取消，msg=" + resp.err_msg);
            },
            // 分享失败了
            fail : function(resp) {
                // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
                alert("分享失败，msg=" + resp.err_msg);
            },
            // 分享成功
            confirm : function(resp) {
                // 分享成功了，我们是不是可以做一些分享统计呢？
                alert("分享成功，msg=" + resp.err_msg);
            },
            // 整个分享过程结束
            all : function(resp,shareTo) {
                // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
                alert("分享" + (shareTo ? "到" + shareTo : "") + "结束，msg=" + resp.err_msg);
            }
        };

        // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
        Api.shareToFriend(wxData, wxCallbacks);

        // 点击分享到朋友圈，会执行下面这个代码
        Api.shareToTimeline(wxData, wxCallbacks);

        // 点击分享到腾讯微博，会执行下面这个代码
        Api.shareToWeibo(wxData, wxCallbacks);

        // iOS上，可以直接调用这个API进行分享，一句话搞定
        //Api.generalShare(wxData,wxCallbacks);


        //
        // 隐藏
        //Api.hideOptionMenu();

        // 显示
        // Api.showOptionMenu();

        //获取当前的网络类型
        Api.getNetworkType(function(network){
            /**
             * network取值：
             *
             * network_type:wifi     wifi网络
             * network_type:edge     非wifi,包含3G/2G
             * network_type:fail     网络断开连接
             * network_type:wwan     2g或者3g
             */
        });
    });

    var $wrapper = $('.wrapper');
    $wrapper.css({
        minHeight: $(window).height()+'px'
    });
    new Menu();
    Loading.hide();
    if($('#page-trip').length) require(["trip"]);
    if($('#page-trip-daily').length) require(["tripDaily"]);
    if($('#page-order').length) require(["order"]);
    if($('#page-order-detail').length) require(["orderDetail"]);
    if($('#page-order-list').length) require(["orderList"]);

});

