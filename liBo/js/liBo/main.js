(function(doc){
    var slider = $('.slider-wrap');
    slider.slider({
        direction: 'x',
        infinite: true,
        duration: 0.6,
        moveRadius: 10
    });
    var sliderObj = slider[0]._slider;

    var currentIndex;
    var shareObj = {};
    var loadingOverlay = $('.js-loadingOverlay');
    var shareDescription = [
        '这个国庆，很想跟你去一个地方。把我的心声写在背面了，你还不点开看看吗？',
        '有一句话，一直都想对你说，今天我终于鼓起勇气，不再口吃。',
        '里面的东西我一笔一画写给你的，只有你知我知天地知，看完也别告诉别人哦。',
        '最近我得到一个机会，可以免费去旅游，你有兴趣和我一起吗？',
        '千万别点进去，我怕你点了你会跟我绝交！',
        '帮我一个忙，点点点……开，萌萌哒~',
        '有些话真的难以当面表达，今天终于有勇气写下来，你看看吧！'
    ];
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
        shareObj.title = '';
        shareObj.link = location.protocol+'//'+location.hostname+location.pathname+'?'+'src_id='+OE.user_id+'&'+'card_id='+(currentIndex+1);
        shareObj.desc = shareDescription[currentIndex];
        shareObj.img_url = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-'+(currentIndex+1)+'.jpg';
        alert(shareObj.link);
    }
    // main control
    (function(){
        var alertLayout = $('.js-alertLayout');
        var detailWindow = $('.js-detailWindow');
        var rankListWindow = $('.js-rankListWindow');
        var detailBtn = $('.js-showDetail');
        var rankBtn = $('.js-showRankList');

        detailBtn.on('click', function(){
            alertLayout.addClass('is-alert-show');
            detailWindow.addClass('is-alertDetail-show');
        });
        rankBtn.on('click', function(){
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
            var currentIndex = sliderObj._index;
            var nextIndex = currentIndex + 1 > $items.length -1 ? 0 : currentIndex + 1;
            var $nextSlide = $items.eq(nextIndex).find('img');
            $nextSlide.lazyload();
        };
        $lastItem.find('img').on('load', function(){
            isAllLoaded = true;
        });
        sliderComponent.on('slide:after', loadAround);
        sliderPrevBtn.on('click', function(){
            if(sliderObj._index === 0 && !isAllLoaded) {
                return;
            }
            slider.slider('prev');
        });
        sliderNextBtn.on('click', function(){
            slider.slider('next');
        });
    })();


    // preview control
    (function(){
        var previewLayer = $('.js-previewLayer');
        var selectBtn = $('.js-showPreview');
        var closeBtn = $('.js-hidePreview');
        var rotateScope = $('.js-rotate-scope');
        var frontPage = $('.js-frontPage');
        var backPage = $('.js-backPage');
        var pageInfo = $('.js-pageInfo');
        var loadingOverlay = $('.js-loadingOverlay');
        var remindLayer = $('.js-remindLayer');
        var sendBtn = $('.js-sendBtn');
        function setImgUrl(index){
            var frontBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-';
            var backBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-back-';
            var infoBase = 'http://weijing.qiniudn.com/promotion-liBo-card-preview-info-';
            index += 1;
            frontBase = frontBase + index + '.'+'jpg?v=324';
            backBase = backBase + index + '.' + 'png?v=453';
            infoBase = infoBase + index +'.'+'png?v=234';
            frontPage.attr('src', frontBase);
            backPage.attr('src', backBase);
            pageInfo.attr('src', infoBase);
        }
        var previewLayerCtl = function(){
            var currentIndex = sliderObj._index;
            if(previewLayer.hasClass('is-previewLayer-show')) {
                previewLayer.removeClass('is-previewLayer-show');
                return;
            }
            loadingOverlay.addClass('is-loadingOverlay-show');
            setImgUrl(currentIndex);
            if(backPage[0].complete === true) {
                loadingOverlay.removeClass('is-loadingOverlay-show');
            }
            previewLayer.addClass('is-previewLayer-show');
            previewLayer[0].currentIndex= currentIndex;
            backPage.on('load', function(){
                loadingOverlay.removeClass('is-loadingOverlay-show');
            });
        };
        var shareCtl = function(){
            remindLayer.toggleClass('is-remindLayer-show');
        };
        var rotateCtl = function(){
            $(this).toggleClass('is-turnOver');
        };
        selectBtn.on('click', previewLayerCtl);
        closeBtn.on('click', previewLayerCtl);
        sendBtn.on('click', shareCtl);
        remindLayer.on('click', shareCtl);
        rotateScope.on('click', rotateCtl);
    })();

    // status control
    (function(){
        var statusLayer = $('.js-status');
        statusLayer.addClass('is-alertStatus-show');
        statusLayer.on('click', function(){
            statusLayer.removeClass('is-alertStatus-show');
        });
    })();

})(document);