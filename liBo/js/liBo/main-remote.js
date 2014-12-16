$(function(){
    var slider = $('.slider-wrap');
    slider.slider({
        direction: 'x',
        infinite: true,
        duration: 0.6,
        moveRadius: 10
    });
    var OE = window.OE;
    var currentIndex = 0;
    var sliderObj = slider[0]._slider;
    var shareObj = {};
    var loadingOverlay = $('.js-loadingOverlay');
    var selectBtn = $('.js-showPreview');
    var closeBtn = $('.js-hidePreview');
    var shareDescription = [
        '这个国庆，很想跟你去一个地方。把我的心声写在背面了，你还不点开看看吗？',
        '有一句话，一直都想对你说，今天我终于鼓起勇气，不再口吃。',
        '里面的东西我一笔一画写给你的，只有你知我知天地知，看完也别告诉别人哦。',
        '最近我得到一个机会，可以免费去旅游，你有兴趣和我一起吗？',
        '千万别点进去，我怕你点了你会跟我绝交！',
        '帮我一个忙，点点点……开，萌萌哒~',
        '有些话真的难以当面表达，今天终于有勇气写下来，你看看吧！'
    ];
    var timerid;
    /**
     * 控制自动滑动
     * @param  {number} command -1：停止自动滑动；0: 设置自动滑动；1：把自动滑动重置；
     */
    var automaticSlide = function(command){
        if(command === -1) {
            clearTimeout(timerid);
        } else if(command === 1) {
            clearTimeout(timerid);
            timerid = setTimeout(function(){
                automaticSlide(0);
            }, 3000);
        } else {
            timerid = setTimeout(function(){
                automaticSlide(0);
                slider.slider('next');
            }, 3000);
        }
    };
    document.addEventListener('WeixinJSBridgeReady', function(){
        WeixinJSBridge.on('menu:share:appmessage', function(){
            shareCtl();
            WeixinJSBridge.invoke('sendAppMessage', shareObj, function(res){
            });
        });
        WeixinJSBridge.on('menu:share:timeline', function(){
            shareCtl();
            WeixinJSBridge.invoke('shareTimeline', shareObj, function(res){
            });
        });
    });
    function shareCtl(){
        if(currentIndex === undefined) {
            currentIndex = 0;
        }
        shareObj.title = '十一旅行季，让明信片飞';
        shareObj.link = location.protocol+'//'+location.hostname+location.pathname+'?'+'src_id='+OE.user_id+'&'+'card_id='+currentIndex;
        shareObj.desc = shareDescription[currentIndex];
        shareObj.img_url = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-'+(currentIndex+1)+'.jpg';
    }
    bootUp();
    function bootUp(){
        var followUrl = '';
        OE.isSubscribed(followUrl, function(e){
            if(typeof e === 'string' && e === 'error') {
                showFailWindow('error');
                return;
            }
            loadingOverlay.addClass('is-loadingOverlay-show');
            if(OE.src_id !== undefined) {
                OE.acceptPostcard();
                showPreviewWindow(OE.card_id, true);
            } else {
                showPreviewWindow();
                automaticSlide(0);
            }
            loadingOverlay.removeClass('is-loadingOverlay-show');
        });
    }
    function showFailWindow(failType) {
        var statusLayer = $('.js-status');
        statusLayer.addClass('is-alertStatus-show');
        if(failType === 'error') {
            var errorWindow = $('.js-errorWindow');
            var errorBtn = $('.js-statusBtn');
            errorWindow.addClass('is-errorWindow-show');
            errorBtn.on('click', function(){
                location.reload(true);
            });
        } else if(failType === 'subscribe') {
            var subscribeWindow = $('.js-subscribeWindow');
            var subscribeBtn = $('.js-subscribeBtn');
            subscribeWindow.addClass('is-subscribeWindow-show');
            subscribeBtn.on('click', function(){
                location.href = 'http://mp.weixin.qq.com/s?__biz=MjM5NzM3MTkwMQ==&mid=202759231&idx=1&sn=710e6aa96d2fbaa24576711156a67daa#rd';
            });
        }
    }
    function showPreviewWindow (cardId, isAccept) {
        var previewLayer = $('.js-previewLayer');
        var rotateScope = $('.js-rotate-scope');
        var frontPage = $('.js-frontPage');
        var backPage = $('.js-backPage');
        var pageInfo = $('.js-pageInfo');
        var remindLayer = $('.js-remindLayer');
        var sendBtn = $('.js-sendBtn');
        var removePreviewLayer = function(){
            previewLayer.removeClass('is-previewLayer-show');
            if(OE.user_subscribed === false) {
                showFailWindow('subscribe');
                return;
            }
            automaticSlide(0);
            if(closeBtn.css('display') !== 'block') {
                closeBtn.css('display', 'block');
            }
            sendBtn.children('img').attr('src', 'http://weijing.qiniudn.com/promotion-liBo-preview-send.png');
            sendBtn.off('click', removePreviewLayer);
            sendBtn.on('click', remindShare);
        };
        if(isAccept) {
            previewLayer.addClass('is-previewLayer-show');
            sendBtn.children('img').attr('src', 'http://weijing.qiniudn.com/promotion-liBo-preview-join.png?v=23123');
            setImgUrl(cardId);
            closeBtn.css('display', 'none');
            sendBtn.on('click', removePreviewLayer);
        } else {
            sendBtn.children('img').attr('src', 'http://weijing.qiniudn.com/promotion-liBo-preview-send.png');
            sendBtn.on('click', remindShare);
        }
        rotateScope.on('click', rotateCtl);
        function setImgUrl(index) {
            var frontBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-';
            var backBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-back-';
            var infoBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-info-';
            index = Number(index);
            index += 1;
            frontBase = frontBase + index + '.'+'jpg';
            backBase = backBase + index + '.' + 'png';
            infoBase = infoBase + index +'.'+'png';
            if(frontPage.attr('src') === frontBase) {
                return;
            }
            frontPage.attr('src', frontBase);
            backPage.attr('src', backBase);
            pageInfo.attr('src', infoBase);
        }
        function previewLayerCtl(){
            currentIndex = sliderObj._index;
            if(previewLayer.hasClass('is-previewLayer-show')) {
                previewLayer.removeClass('is-previewLayer-show');
                rotateScope.removeClass('is-turnOver');
                automaticSlide(1);
                return;
            }
            loadingOverlay.addClass('is-loadingOverlay-show');
            automaticSlide(-1);
            setImgUrl(currentIndex);
            if(backPage[0].complete === true) {
                loadingOverlay.removeClass('is-loadingOverlay-show');
            }
            previewLayer.addClass('is-previewLayer-show');
            previewLayer[0].currentIndex= currentIndex;
            backPage.on('load', function(){
                loadingOverlay.removeClass('is-loadingOverlay-show');
            });
        }
        function remindShare(){
            remindLayer.toggleClass('is-remindLayer-show');
        }
        function rotateCtl(){
            $(this).toggleClass('is-turnOver');
        }
        closeBtn.on('click', previewLayerCtl);
        selectBtn.on('click', previewLayerCtl);
        remindLayer.on('click', remindShare);
    }

    // main control
    (function(){
        var alertLayout = $('.js-alertLayout');
        var detailWindow = $('.js-detailWindow');
        var rankListWindow = $('.js-rankListWindow');
        var detailBtn = $('.js-showDetail');
        var rankBtn = $('.js-showRankList');
        var rankContent = $('.js-rankContent');
        var rankTotal = $('.js-rankTotal');
        var hasRankData = false;

        detailBtn.on('click', function(){
            alertLayout.addClass('is-alert-show');
            detailWindow.addClass('is-alertDetail-show');
        });
        rankBtn.on('click', function(){
            if(!hasRankData) {
                OE.getLadder(function(e){
                    if(typeof e === 'string' && e==='error') {
                        rankContent[0].innerHTML = '请求数据错误';
                    } else {
                        $(e.html).appendTo(rankContent);
                        rankTotal.text(e.mine);
                        hasRankData = true;
                    }
                });
            }
            alertLayout.addClass('is-alert-show');
            rankListWindow.addClass('is-alertRankList-show');
        });
        alertLayout.on('click', function(){
            alertLayout.removeClass('is-alert-show');
            detailWindow.removeClass('is-alertDetail-show');
            rankListWindow.removeClass('is-alertRankList-show');
        });
    })();

    // slider control
    (function(){
        var sliderPrevBtn = $('.js-slider-prev');
        var sliderNextBtn = $('.js-slider-next');
        var $items = sliderObj.$items;
        var $lastItem = $items.eq(-1);
        var sliderComponent = slider[0]._slider.$inner;
        var isAllLoaded = false;
        var loadAround = function(){
            var $nextSlideImg;
            var tempIndex;
            tempIndex = sliderObj._index;
            if(tempIndex - currentIndex === 1){
                tempIndex = tempIndex + 1 > $items.length -1 ? 0 : tempIndex + 1;
            } else if(tempIndex - currentIndex === -1) {
                tempIndex = tempIndex - 1 < 0 ? $items.length -1 : tempIndex - 1;
            }
            currentIndex = sliderObj._index;
            $nextSlideImg = $items.eq(tempIndex).find('img');
//            console.log($nextSlideImg)
            $nextSlideImg.lazyload(function(e){
                console.log(e,this)
            });
        };
        
        $lastItem.find('img').on('load', function(){
            isAllLoaded = true;
            $items.eq(0).prev().find('img').lazyload();
        });
        sliderComponent.on('slide:after', loadAround);
        sliderPrevBtn.on('click', function(){
            if(sliderObj._index === 0 && !isAllLoaded) {
                return;
            }
            slider.slider('prev');
            automaticSlide(1);
        });
        sliderNextBtn.on('click', function(){
            slider.slider('next');
            automaticSlide(1);
        });
    })();
});
