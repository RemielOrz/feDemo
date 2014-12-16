/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */

require.config({
    //enforceDefine: true,
    baseUrl: "../js/app/demo/",
    paths: {
        "$":"../../lib/zepto.min",
        "OE": "../../module/OE",
        "Calendar": "../../module/calendar/calendar",
        "MsgBox": "../../module/msgBox/msgBox"
    },
    shim: {
        "$": {
            exports: "$"
        }
    }
});

//
require(["Calendar","MsgBox"],function(Calendar, MsgBox){
    //console.log(Calendar);
    window.b = new MsgBox();
    window.a = new Calendar("body",{
        callback: function(){
            console.log(this);
            var $this = $(this);

            b
                .setContent($this.attr("date"),$this.find('.ui-calendar__day-price').text()+"<br>"+$this.find('.ui-calendar__day-remain').text(),"哇,有票!!!")
                .show();

        }
    });
});

