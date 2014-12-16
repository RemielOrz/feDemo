/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
//
define(["OE","TabSelection"],function(OE,TabSelection){
    console.log('Page Module: orderList');
    var $ = OE.$;
    var u = OE.utils;

    /*var nav = new TabSelection({
        items:[
            {
                text:'未处理',
                value:0
            },
            {
                text:'已支付',
                value:1
            }
        ]
    });
    $('.__nav').append(nav.$el);*/
    $('.__nav').tabSelection({
        items:[
            {
                text:'未处理',
                value:0
            },
            {
                text:'已支付',
                value:1
            }
        ]
    });



});

