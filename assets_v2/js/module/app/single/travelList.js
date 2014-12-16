/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
define(["OE","Menu","lazyload","_","Loading","Swipe","AsideWindow"],function(OE,Menu,lazyload,_,Loading,Swipe,AsideWindow){
    console.log('Page Module: travel list');
    var $ = OE.$;
    var u = OE.utils;
    var times = 1;
    function fn(){
        OE.log('Page:[travel list], Times:' ,times++);
        Loading.hide();
        $.get(OE.BASE_URL+'/template/trip/tpl_destination_travel_list.html', function(html){
            console.log('template [tpl_destination_travel_list.html] onload');
            var $html = $(html);
            var compiled = _.template($html.html());
            $('.wrapper').append(compiled({}));

            $("[lazyload]").lazyload(function(e){console.log(e)});

        });
    }

    return fn;
});

