/*!
 * Created By remiel.
 * Date: 14-11-06
 * Time: 上午11:15
 */

require.config({
    baseUrl: location.port === "3000" ? "../js/app/" : "./assets/js/app/",
    paths: {
        "_":"../dest/lib/underscore/underscore.min",
        "Path":"../dest/lib/path/path.min",
        "$":"../dest/lib/zepto.min",
        "lazyload":"../dest/lazyload/zepto.lazyload",
        "carousel": "../dest/carousel/carousel",
        "Swipe": "../dest/swipe/swipe",
        "WeixinApi": "../dest/WeixinApi/WeixinApi",


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

        "destination": "../module/app/single/destination",
        "destinationInfo": "../module/app/single/destinationInfo",
        "destinationList": "../module/app/single/destinationList",
        "themeList": "../module/app/single/themeList",
        "travelList": "../module/app/single/travelList",
        "cityList": "../module/app/single/cityList",
        "city": "../module/app/single/city"
    },
    shim: {
        "$": {
            exports: "$"
        },
        "_": {
            exports: "_"
        },
        "Path": {
            exports: "Path"
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
require(["OE","Menu","Loading","WeixinApi","_","Path"],function(OE,Menu,Loading,WeixinApi,_,Path){
    OE.log('[app init]');
    var $ = OE.$;
    var u = OE.utils;

    OE.BASE_URL = location.port === "3000" ? "" : "./assets";

    Loading.hide();
    $(document)
        .on('ajaxBeforeSend', function(e, xhr, options){
            // This gets fired for every Ajax request performed on the page.
            // The xhr object and $.ajax() options are available for editing.
            // Return false to cancel this request.
            OE.log('ajax:[ajaxBeforeSend]');
            Loading.show();
        })
        .on('ajaxComplete', function(e, xhr, options){
            OE.log('ajax:[ajaxComplete]');
            Loading.hide();
        });

    //init $wrapper
    var $wrapper = $('.wrapper');
    $wrapper.css({
        minHeight: $(window).height()+'px'
    });
    //create menu
    var menu = window.menu = new Menu();

    //route
    //routerChange
    var routerChange = function(){
        $wrapper
            .empty()
            .append(menu.$icon);
        Loading.show();
    };
    //目的地
    Path.map("#/list")
        .enter([function(){
            $wrapper.attr('id','page-destination-list');
        }])
        .to(function(){
            Loading.hide();
            require(["destinationList"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //城市列表
    Path.map("#/city")
        .enter([function(){
            $wrapper.attr('id','page-destination-city-list');
        }])
        .to(function(){
            Loading.hide();
            require(["cityList"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //城市
    Path.map("#/city/:id")
        .enter([function(){
            $wrapper.attr('id','page-destination-city');
        }])
        .to(function(){
            Loading.hide();
            require(["city"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //主题列表
    Path.map("#/theme")
        .enter([function(){
            $wrapper.attr('id','page-destination-theme-list');
        }])
        .to(function(){
            Loading.hide();
            require(["themeList"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    Path.map("#/theme/:id")
        .enter([function(){
            $wrapper.attr('id','page-destination-theme-list');
        }])
        .to(function(){
            Loading.hide();
            require(["city"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //旅行地
    Path.map("#/travel")
        .enter([function(){
            $wrapper.attr('id','page-destination-travel-list');
        }])
        .to(function(){
            Loading.hide();
            require(["travelList"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    Path.map("#/travel/:id")
        .enter([function(){
            $wrapper.attr('id','page-destination-travel-list');
        }])
        .to(function(){
            Loading.hide();
            require(["city"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //目的地 实用信息
    Path.map("#/:id/info")
        .enter([function(){
            $wrapper.attr('id','page-destination-info');
        }])
        .to(function(){
            Loading.hide();
            require(["destinationInfo"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    //目的地
    Path.map("#/:id")
        .enter([function(){
            $wrapper.attr('id','page-destination');
        }])
        .to(function(){
            Loading.hide();
            require(["destination"],function(fn){fn();});
            console.log('params: ',this.params)
        })
        .exit(function(){

        });
    Path.root("#/1");
    Path.onRouterChange(function(){
        OE.log('Path:[Router Changed]');
        routerChange();
    });
    Path.listen();


});

