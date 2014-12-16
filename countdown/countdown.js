/*!
 * Created By remiel.
 * Date: 14-8-20
 * Time: 下午5:24
 */
console.log('module:countdown');
(function(){
    var OE = null;
    /*
    * @param1 {number} deadline   结束时间时间戳,单位ms,或Date对象,默认Date.now()
    * @param2 {number} startTime  开始时间时间戳,单位ms,或Date对象,默认Date.now()
    * */
    var Countdown = function(deadline, startTime){
        var _deadline = deadline ? Date.parse(new Date(deadline)) : Date.now()
            ,_startTime = startTime ? Date.parse(new Date(startTime)) : Date.now();
        this.left = (_deadline - _startTime)/1000;
    };
    /*
     * 监听每秒的回调
     * @param1 {number} d 剩余天数
     * @param2 {number} h 剩余小时数
     * @param3 {number} m 剩余分钟数
     * @param4 {number} s 剩余秒数
     * */
    Countdown.prototype.tick = function(callback){
        var left = this.left;
        if(isNaN(left)) return false;
        if(left < 0) left = 0;

        // Number of seconds in every time division
        var self = this
            ,days = 24*60*60
            ,hours = 60*60
            ,minutes = 60
            , d, h, m, s;

        // Number of days left
        d = Math.floor(left / days);
        left -= d*days;

        // Number of hours left
        h = Math.floor(left / hours);
        left -= h*hours;

        // Number of minutes left
        m = Math.floor(left / minutes);
        left -= m*minutes;

        // Number of seconds left
        s = Math.floor(left);

        // Calling an optional user supplied callback
        typeof callback === "function" && callback.call(this, d, h, m, s);

        // Scheduling another call of this function in 1s
        if(self.left > 0){
            setTimeout(function(){
                self.left -= 1;
                self.tick(callback)
            }, 1000);
        }

        return this;
    };

    if(window.define != null) {
        define(function(){
            return Countdown;
        });
    } else {
        OE = window.OE = window.OE ? window.OE : {};
        OE.Countdown = Countdown;
    }

})();