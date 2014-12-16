/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
//
define(["OE","Menu","lazyload","carousel","Calendar","DropBox","_","Modifier","TabSelection"],function(OE,Menu,lazyload,carousel,Calendar,DropBox,_,Modifier,TabSelection){
    console.log('Page Module: orderDetail');
    var $ = OE.$;
    var u = OE.utils;

    var sex = new TabSelection();
    $('#order-detail__sex').append(sex.$el);

});

