/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
//
define(["OE","Menu","lazyload","carousel","Calendar","DropBox","_","Modifier","TabSelection"],function(OE,Menu,lazyload,carousel,Calendar,DropBox,_,Modifier,TabSelection){
    console.log('Page Module: order');
    var $ = OE.$;
    var u = OE.utils;

    new Calendar($('#calendar'));

    var m1 = new Modifier({
        value: 1
    });
    var m2 = new Modifier();
    $('#order__modifier-1').append(m1);
    $('#order__modifier-2').append(m2);

    var $statusBox = $('#status-box');
    $statusBox.on('tap','.__item',function(){
        $(this).remove();
    });

    function cleanStatusBox(){
        var $item = $statusBox
            .find('.__item')
            .not('._cleaning')
            .addClass('_cleaning');
        setTimeout(function(){
            $item.remove();
            cleanStatusBox();
        }, 3000);
    }
    cleanStatusBox();

});

