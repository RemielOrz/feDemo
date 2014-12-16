/*!
 * Created By remiel.
 * Date: 14-9-18
 * Time: 下午3:42
 */

$(function(){

    var OE = {};
    $.extend(OE, window.OE);

    //init
    function init(){
        login();
        getIds();
    }

    //获取src_id,card_id
    function getIds(){
        var path = location.pathname
            ,search = location.search
            ,src_id,card_id;
        search
            .replace('?','')
            .split('&')
            .forEach(function(v,i){
                var tmp = v.split('=');
                if(tmp[0] === 'src_id') src_id = tmp[1];
                if(tmp[0] === 'card_id') card_id = tmp[1];
            });
        OE.src_id = src_id;
        OE.card_id = card_id;
        return {src_id: src_id,card_id: card_id}
    }

    //判断登录
    function getCookie(){
        var PLAY_SESSION = $.fn.cookie("PLAY_SESSION");
        return {PLAY_SESSION: PLAY_SESSION};
    }
    function login(){
        var cookie = getCookie();
        var PLAY_SESSION = cookie.PLAY_SESSION;
        if(!PLAY_SESSION){
            location.href = "/autologin?from=" + location.href + "?rn=" + Date.now();
        }
    }

    //判断关注
    function subscribed(subscribed_url, callback){
        var url = "/api/user/is_subscribed";

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 10000,
            cache: false,
            success: function(d){
                console.log(d);
                if(d.id === "is_subscribed"){
                    if(!d.info.subscribed && subscribed_url){
                        //location.href = subscribed_url;
                    }
                    OE.user_id = d.info.user_id;
                    OE.user_subscribed = d.info.subscribed;
                    typeof callback === "function" && callback.call(this, {user_id:OE.user_id,user_subscribed:OE.user_subscribed});
                }
            },
            error: function(xhr, type){
                console.log(xhr, type);
                typeof callback === "function" && callback.call(this, "error");
            }
        });
    }


    //接收
    function acceptPostcard(callback){

        var url = "/api/sharecnt/actions/inc",
            data = {
                id:"postcard_1",
                info: {
                    user_id: OE.src_id
                }
            };

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            timeout: 10000,
            cache: false,
            success: function(d){
                console.log(d);
                /*if(d.id === "inc_ok"){

                }else if(d.id === "inc_fail"){
                    console.log(d.info.reason);
                }*/

                /*id: inc_ok/inc_fail,
                    info: {
                    reason: '已接收过分享' //错误信息
                }*/
                typeof callback === "function" && callback.call(this, d);
            },
            error: function(xhr, type){
                console.log(xhr, type);
                typeof callback === "function" && callback.call(this, "error", xhr);
            }
        });
    }




    //获取排行榜数据
    var ladderObj;
    function getLadder(callback){
        var url = '/api/sharecnt/ladder?id='+'postcard_1';
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 10000,
            cache: false,
            success: function(d){
                console.log(d);
                //ladderInit = 1;
                var html = [];
                if(d.info.ladder && d.info.ladder.length){
                    $.each(d.info.ladder, function(i,v){
                        if (v.nickname && v.nickname.length > 1){
                            var stringArray = v.nickname.split("");
                            stringArray.splice(1,1,"*");
                            v.nickname = stringArray.join("");
                        }else{
                            v.nickname = "*";
                        }
                        html.push("<tr><td>"+ v.nickname +"</td><td>"+ v.score +"</td></tr>");
                    });

                }
                ladderObj = {
                    html : html.join(""),
                    mine : d.info.mine?d.info.mine : 0
                };
                typeof callback === "function" && callback.call(this, ladderObj);
            },
            error: function(xhr, type){
                console.log(xhr, type);
                typeof callback === "function" && callback.call(this, "error");
            }
        });
    }


    //提示框
    /*var MsgBox = function (){
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
    };*/


    $.extend(OE, {
        //msgBox: new MsgBox(),
        getLadder: getLadder,
        acceptPostcard: acceptPostcard,
        isSubscribed: subscribed
    });

    //GO
    init();
    //$.extend(window.OE, OE);

    if(window.OE){
        $.extend(window.OE, OE);
    }else{
        window.OE = OE;
    }

    /*
    *
    * OE 对象:
    * {
    *   getLadder: 获取排行榜数据
    *   参数:
    *       1.callback(e):
    *           1)成功
    *               {
    *                 html:排行榜html <tr><td><td>
    *                 mine: number 我发出的数量
    *               },
    *           2)失败:"error"
    *
    *   acceptPostcard: 接受明信片
    *   参数:
    *       callback(e):
    *       1.接受成功回调
    *           e: {
    *               id: inc_ok/inc_fail,
    *               info: {
    *                   reason: '已接收过分享' //错误信息
    *               }
    *              }
    *       2.失败:
    *           1: 请求出错: e: "error"
    *
    *   isSubscribed: 是否已关注
    *   参数:
    *       1.subscribed_url: 一键关注链接
    *       2.callback(e):
    *          1)成功:{user_id:user_id}
    *          2)失败:"error"
    *
    *   src_id: 别人分享链接上的用户id
    *   user_id: 用户id, isSubscribed调用后取得
    * }
    * */
});
