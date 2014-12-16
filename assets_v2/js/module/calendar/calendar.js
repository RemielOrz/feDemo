/*!
 * Created By remiel.
 * Date: 14-9-28
 * Time: 上午9:37
 */
define(["OE"],function(OE){
    console.log("module:Calendar");

    var u = OE.utils
        ,$ = OE.$;

    function Calendar( element, options ) {
        this.$el = $(element);
        var defaults = {
            monthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
            , shortDayNames: ["日", "一", "二", "三", "四", "五", "六"]
            , startOfWeek: 1
        };
        this.options = $.extend({}, defaults, options );


        this.init();
        console.log(this)
    }

    Calendar.prototype = {
        init: function(){

            var $nav = this.nav('ui-calendar__nav', 1);

            this.$month = $nav.find('.ui-calendar__month');
            this.$year = $nav.find('.ui-calendar__year');

            var $calendar__bd = $("<div>").addClass('ui-calendar__bd');

            // Populate day of week headers, realigned by startOfWeek.
            for (var i = 0; i < this.options.shortDayNames.length; i++) {
                $calendar__bd.append('<div class="ui-calendar__week">' + this.options.shortDayNames[(i + this.options.startOfWeek) % 7] + '</div>');
            }

            this.$days = $('<div></div>').addClass('ui-calendar__days');
            $calendar__bd.append(this.$days);


            this.$ipt = $('<input type="hidden">');

            this.$calendar = $('<div></div>')
                //.on(u.events.down,function(e) { e.stopPropagation() })
                // Use this to prevent accidental text selection.
                //.mousedown(function(e) { e.preventDefault() })
                .addClass('ui-calendar')
                .append($nav)
                .append($calendar__bd)
                .append(this.$ipt)
                .appendTo(this.$el);

            this.$ipt.change($.proxy(function() { this.selectDate(); }, this));

            this.selectDate(this.options.date);

            if(this.options.date){
                $('._selected', this.$days).removeClass('_selected');
                var $day = $('[date="' + this.format(this.options.date) + '"]', this.$days).addClass('_selected');
                typeof this.options.callback === "function" && this.options.callback.call($day[0]);
            }
        }

        , nav: function( c, months ) {
            var $subnav = $('<div>' +
                '<span class="ui-calendar__prev u-fl oefont-arrow-left"></span>' +
                '<span class="ui-calendar__year"></span>' +
                '<span class="">-</span>' +
                '<span class="ui-calendar__month"></span>' +
                '<span class="ui-calendar__next u-fr oefont-arrow-right"></span>' +
                '</div>').addClass(c);
            this.$prev = $('.ui-calendar__prev', $subnav);
            this.$next = $('.ui-calendar__next', $subnav);
            this.$prev.on(u.events.down,$.proxy(function() {
                this.currentEvent = 'prev';
                this.ahead(-months, 0);
            }, this));
            this.$next.on(u.events.down,$.proxy(function() {
                this.currentEvent = 'next';
                this.ahead(months, 0);
            }, this));
            return $subnav;

        }

        , updateName: function($area, s) {
            // Update either the month or year field
            $area.html(s);
        }

        , parse: function(s) {
            // Parse a partial RFC 3339 string into a Date.
            var m;
            if ((m = s.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/))) {
                return new Date(m[1], m[2] - 1, m[3]);
            } else {
                return null;
            }
        }

        , format: function(date) {
            // Format a Date into a string as specified by RFC 3339.
            var month = (date.getMonth() + 1).toString(),
                dom = date.getDate().toString();
            if (month.length === 1) {
                month = '0' + month;
            }
            if (dom.length === 1) {
                dom = '0' + dom;
            }
            return date.getFullYear() + '-' + month + "-" + dom;
        }

        , daysBetween: function(start, end) {
            // Return number of days between ``start`` Date object and ``end``.
            var _start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
            var _end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
            return (_end - _start) / 86400000;
        }

        , findClosest: function(dow, date, direction) {
            // From a starting date, find the first day ahead of behind it that is
            // a given day of the week.
            var difference = direction * (Math.abs(date.getDay() - dow - (direction * 7)) % 7);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
        }

        , rangeStart: function(date) {
            // Get the first day to show in the current calendar view.
            return this.findClosest(this.options.startOfWeek,
                new Date(date.getFullYear(), date.getMonth()),
                -1);
        }

        , rangeEnd: function(date) {
            // Get the last day to show in the current calendar view.
            return this.findClosest((this.options.startOfWeek - 1) % 7,
                new Date(date.getFullYear(), date.getMonth() + 1, 0),
                1);
        }


        , selectDate: function(date) {
            if (typeof(date) == "undefined") {
                date = this.parse(this.$ipt.val());
            }
            if (!date) date = new Date();
            this.selectedDate = date;
            this.selectedDateStr = this.format(this.selectedDate);
            this.selectMonth(this.selectedDate);
        }


        , selectMonth: function(date) {
            var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);

            if (!this.curMonth || !(this.curMonth.getFullYear() == newMonth.getFullYear() &&
                this.curMonth.getMonth() == newMonth.getMonth())) {

                this.curMonth = newMonth;

                var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
                var num_days = this.daysBetween(rangeStart, rangeEnd);
                this.$days.empty();

                for (var ii = 0; ii <= num_days; ii++) {
                    var thisDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + ii, 12, 0);
                    var $day = $('<div></div>')
                        .attr('date', this.format(thisDay))
                        .addClass('ui-calendar__day');
                    var $num = $('<div></div>')
                        .addClass('ui-calendar__day-num')
                        .text(thisDay.getDate());
                    var $remain = $('<div></div>')
                        .addClass('ui-calendar__day-remain');
                    var $price = $('<div></div>')
                        .addClass('ui-calendar__day-price');
                    $day.append($num)
                        .append($price)
                        .append($remain);

                    if (thisDay.getMonth() != date.getMonth()) {
                        $day.addClass('_overlap');
                    }
                    this.$days.append($day);
                }

                this.updateName(this.$month, this.options.monthNames[date.getMonth()]);
                this.updateName(this.$year, this.curMonth.getFullYear());

                //this.bindClickDay();

                $("[date='" + this.format(new Date()) + "']", this.$days).addClass('ui-calendar__today');

                this.getDayInfo();
            }else{
                $('._selected', this.$days).removeClass('_selected');
            }

        }

        , bindClickDay: function(){
            var self = this;
            this.$days.find('._selectable').on(u.events.down,function(e) {
                var $targ = $(this);
                // The date= attribute is used here to provide relatively fast
                // selectors for setting certain date cells.
                self.update($targ.attr("date"));
                $targ.addClass('_selected');
                typeof self.options.callback === "function" && self.options.callback.call(this);
            });
        }

        , getDayInfo: function(){
            /*$.get('../js/module/calendar/data.json', $.proxy(function(d){
                console.log(d);
                this.setDayInfo(d);
            },this));*/
            var curMonth = this.curMonth.getMonth()+1;
            var curYear = this.curMonth.getFullYear();
            var nextMonth = new Date(this.curMonth.getFullYear(),this.curMonth.getMonth()+2,this.curMonth.getDate());
            var curMonthPlans = [];
            if(this.options.plans){
                var lastPlanDate = u.date.parse(this.options.plans[this.options.plans.length-1].startAt);
                var firstPlanDate = u.date.parse(this.options.plans[0].startAt);
                $.each(this.options.plans, function(i, v){
                    var thisDate = u.date.parse(v.startAt);
                    if(thisDate.getFullYear() == curYear && thisDate.getMonth()+1 == curMonth){
                        curMonthPlans.push(v);
                    }
                });
                if(curMonthPlans.length){
                    this.setDayInfo(curMonthPlans);
                }else{
                    if(lastPlanDate < this.curMonth){
                        this.currentEvent == 'next' && this.ahead(-1, 0);
                    }else{
                        this.currentEvent == 'next' && this.ahead(1, 0);
                    }
                    if(firstPlanDate >= new Date(this.curMonth.getFullYear(),this.curMonth.getMonth(),this.curMonth.getDate())){
                        this.currentEvent == 'prev' && this.ahead(1, 0);
                    }else{
                        this.currentEvent == 'prev' && this.ahead(-1, 0);
                    }
                }


                //btn-next show & hide
                if(lastPlanDate < new Date(this.curMonth.getFullYear(),this.curMonth.getMonth()+2,this.curMonth.getDate())){
                    this.$next.hide();
                }else{
                    this.$next.show();
                }
                //btn-prev show & hide
                if(firstPlanDate >= this.curMonth){
                    this.$prev.hide();
                }else{
                    this.$prev.show();
                }
            }else{
                this.$next.hide();
                this.$prev.hide();
            }
        }
        , setDayInfo: function(d){
            var self = this;
            $('._selected', this.$days).removeClass('_selected');

            $.each(d, $.proxy(function(i,v){
                var $day = $('[date="' + v.startAt + '"]', this.$days);
                $day
                    .find('.ui-calendar__day-remain')
                    .html("剩余:" + v.discountPrice);
                $day
                    .find('.ui-calendar__day-price')
                    .html("￥"+ v.originPrice);
                $day
                    .addClass('_selectable')
                    .attr('planid', v.id);
                if(i == 0) {
                    $day.addClass('_selected');
                    typeof self.options.callback === "function" && self.options.callback.call($day[0]);
                }
            },this));
            this.bindClickDay();
        }
        , update: function(s) {
            this.$ipt.val(s);
            this.$ipt.trigger('change');
        }

        , ahead: function(months, days) {
            // Move ahead ``months`` months and ``days`` days, both integers, can be
            // negative.
            this.selectDate(new Date(this.selectedDate.getFullYear(),
                    this.selectedDate.getMonth() + months,
                    this.selectedDate.getDate() + days));
        }

    };
    OE.ui.Calendar = Calendar;
    return Calendar;
});