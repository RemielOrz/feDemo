var WeixinApi=function(){"use strict";function a(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("shareTimeline",{appid:a.appId?a.appId:"",img_url:a.imgUrl,link:a.link,desc:a.title,title:a.desc,img_width:"640",img_height:"640"},function(a){switch(a.err_msg){case"share_timeline:cancel":b.cancel&&b.cancel(a);break;case"share_timeline:confirm":case"share_timeline:ok":b.confirm&&b.confirm(a);break;case"share_timeline:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:timeline",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function b(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("sendAppMessage",{appid:a.appId?a.appId:"",img_url:a.imgUrl,link:a.link,desc:a.desc,title:a.title,img_width:"640",img_height:"640"},function(a){switch(a.err_msg){case"send_app_msg:cancel":b.cancel&&b.cancel(a);break;case"send_app_msg:confirm":case"send_app_msg:ok":b.confirm&&b.confirm(a);break;case"send_app_msg:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:appmessage",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function c(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("shareWeibo",{content:a.desc,url:a.link},function(a){switch(a.err_msg){case"share_weibo:cancel":b.cancel&&b.cancel(a);break;case"share_weibo:confirm":case"share_weibo:ok":b.confirm&&b.confirm(a);break;case"share_weibo:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:weibo",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function d(a,b){b=b||{};var c=function(a,c){if("timeline"==a.shareTo){var d=c.title;c.title=c.desc||d,c.desc=d}a.generalShare({appid:c.appId?c.appId:"",img_url:c.imgUrl,link:c.link,desc:c.desc,title:c.title,img_width:"640",img_height:"640"},function(c){switch(c.err_msg){case"general_share:cancel":b.cancel&&b.cancel(c,a.shareTo);break;case"general_share:confirm":case"general_share:ok":b.confirm&&b.confirm(c,a.shareTo);break;case"general_share:fail":default:b.fail&&b.fail(c,a.shareTo)}b.all&&b.all(c,a.shareTo)})};WeixinJSBridge.on("menu:general:share",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(d,a)},b.ready&&b.ready(d,d.shareTo)):(b.ready&&b.ready(d,d.shareTo),c(d,a))})}function e(a,b){b=b||{},WeixinJSBridge.invoke("addContact",{webtype:"1",username:a},function(a){var c=!a.err_msg||"add_contact:ok"==a.err_msg||"add_contact:added"==a.err_msg;c?b.success&&b.success(a):b.fail&&b.fail(a)})}function f(a,b){a&&b&&0!=b.length&&WeixinJSBridge.invoke("imagePreview",{current:a,urls:b})}function g(){WeixinJSBridge.call("showOptionMenu")}function h(){WeixinJSBridge.call("hideOptionMenu")}function i(){WeixinJSBridge.call("showToolbar")}function j(){WeixinJSBridge.call("hideToolbar")}function k(a){a&&"function"==typeof a&&WeixinJSBridge.invoke("getNetworkType",{},function(b){a(b.err_msg)})}function l(a){a=a||{},WeixinJSBridge.invoke("closeWindow",{},function(b){switch(b.err_msg){case"close_window:ok":a.success&&a.success(b);break;default:a.fail&&a.fail(b)}})}function m(a){if(a&&"function"==typeof a){var b=this,c=function(){a(b)};"undefined"==typeof window.WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",c,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",c),document.attachEvent("onWeixinJSBridgeReady",c)):c()}}function n(){return/MicroMessenger/i.test(navigator.userAgent)}function o(a){a=a||{},WeixinJSBridge.invoke("scanQRCode",{},function(b){switch(b.err_msg){case"scan_qrcode:ok":a.success&&a.success(b);break;default:a.fail&&a.fail(b)}})}function p(a,b){b=b||{},WeixinJSBridge.invoke("getInstallState",{packageUrl:a.packageUrl||"",packageName:a.packageName||""},function(a){var c=a.err_msg,d=c.match(/state:yes_?(.*)$/);d?(a.version=d[1]||"",b.success&&b.success(a)):b.fail&&b.fail(a),b.all&&b.all(a)})}function q(a){window.onerror=function(b,c,d,e){if("function"==typeof a)a({message:b,script:c,line:d,column:e});else{var f=[];f.push("额，代码有错。。。"),f.push("\n错误信息：",b),f.push("\n出错文件：",c),f.push("\n出错位置：",d+"行，"+e+"列"),alert(f.join(""))}}}return{version:"2.5",enableDebugMode:q,ready:m,shareToTimeline:a,shareToWeibo:c,shareToFriend:b,generalShare:d,addContact:e,showOptionMenu:g,hideOptionMenu:h,showToolbar:i,hideToolbar:j,getNetworkType:k,imagePreview:f,closeWindow:l,openInWeixin:n,getInstallState:p,scanQRCode:o}}();