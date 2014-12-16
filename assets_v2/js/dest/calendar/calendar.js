define(["OE"],function(a){function b(a,b){this.$el=d(a);var c={monthNames:["01","02","03","04","05","06","07","08","09","10","11","12"],shortDayNames:["日","一","二","三","四","五","六"],startOfWeek:1};this.options=d.extend({},c,b),this.init(),console.log(this)}console.log("module:Calendar");var c=a.utils,d=a.$;return b.prototype={init:function(){var a=this.nav("ui-calendar__nav",1);this.$month=a.find(".ui-calendar__month"),this.$year=a.find(".ui-calendar__year");for(var b=d("<div>").addClass("ui-calendar__bd"),c=0;c<this.options.shortDayNames.length;c++)b.append('<div class="ui-calendar__week">'+this.options.shortDayNames[(c+this.options.startOfWeek)%7]+"</div>");if(this.$days=d("<div></div>").addClass("ui-calendar__days"),b.append(this.$days),this.$ipt=d('<input type="hidden">'),this.$calendar=d("<div></div>").addClass("ui-calendar").append(a).append(b).append(this.$ipt).appendTo(this.$el),this.$ipt.change(d.proxy(function(){this.selectDate()},this)),this.selectDate(this.options.date),this.options.date){d("._selected",this.$days).removeClass("_selected");var e=d('[date="'+this.format(this.options.date)+'"]',this.$days).addClass("_selected");"function"==typeof this.options.callback&&this.options.callback.call(e[0])}},nav:function(a,b){var e=d('<div><span class="ui-calendar__prev u-fl oefont-arrow-left"></span><span class="ui-calendar__year"></span><span class="">-</span><span class="ui-calendar__month"></span><span class="ui-calendar__next u-fr oefont-arrow-right"></span></div>').addClass(a);return this.$prev=d(".ui-calendar__prev",e),this.$next=d(".ui-calendar__next",e),this.$prev.on(c.events.down,d.proxy(function(){this.currentEvent="prev",this.ahead(-b,0)},this)),this.$next.on(c.events.down,d.proxy(function(){this.currentEvent="next",this.ahead(b,0)},this)),e},updateName:function(a,b){a.html(b)},parse:function(a){var b;return(b=a.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/))?new Date(b[1],b[2]-1,b[3]):null},format:function(a){var b=(a.getMonth()+1).toString(),c=a.getDate().toString();return 1===b.length&&(b="0"+b),1===c.length&&(c="0"+c),a.getFullYear()+"-"+b+"-"+c},daysBetween:function(a,b){var c=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()),d=Date.UTC(b.getFullYear(),b.getMonth(),b.getDate());return(d-c)/864e5},findClosest:function(a,b,c){var d=c*(Math.abs(b.getDay()-a-7*c)%7);return new Date(b.getFullYear(),b.getMonth(),b.getDate()+d)},rangeStart:function(a){return this.findClosest(this.options.startOfWeek,new Date(a.getFullYear(),a.getMonth()),-1)},rangeEnd:function(a){return this.findClosest((this.options.startOfWeek-1)%7,new Date(a.getFullYear(),a.getMonth()+1,0),1)},selectDate:function(a){"undefined"==typeof a&&(a=this.parse(this.$ipt.val())),a||(a=new Date),this.selectedDate=a,this.selectedDateStr=this.format(this.selectedDate),this.selectMonth(this.selectedDate)},selectMonth:function(a){var b=new Date(a.getFullYear(),a.getMonth(),1);if(this.curMonth&&this.curMonth.getFullYear()==b.getFullYear()&&this.curMonth.getMonth()==b.getMonth())d("._selected",this.$days).removeClass("_selected");else{this.curMonth=b;var c=this.rangeStart(a),e=this.rangeEnd(a),f=this.daysBetween(c,e);this.$days.empty();for(var g=0;f>=g;g++){var h=new Date(c.getFullYear(),c.getMonth(),c.getDate()+g,12,0),i=d("<div></div>").attr("date",this.format(h)).addClass("ui-calendar__day"),j=d("<div></div>").addClass("ui-calendar__day-num").text(h.getDate()),k=d("<div></div>").addClass("ui-calendar__day-remain"),l=d("<div></div>").addClass("ui-calendar__day-price");i.append(j).append(l).append(k),h.getMonth()!=a.getMonth()&&i.addClass("_overlap"),this.$days.append(i)}this.updateName(this.$month,this.options.monthNames[a.getMonth()]),this.updateName(this.$year,this.curMonth.getFullYear()),d("[date='"+this.format(new Date)+"']",this.$days).addClass("ui-calendar__today"),this.getDayInfo()}},bindClickDay:function(){var a=this;this.$days.find("._selectable").on(c.events.down,function(){var b=d(this);a.update(b.attr("date")),b.addClass("_selected"),"function"==typeof a.options.callback&&a.options.callback.call(this)})},getDayInfo:function(){var a=this.curMonth.getMonth()+1,b=this.curMonth.getFullYear(),e=(new Date(this.curMonth.getFullYear(),this.curMonth.getMonth()+2,this.curMonth.getDate()),[]);if(this.options.plans){var f=c.date.parse(this.options.plans[this.options.plans.length-1].startAt),g=c.date.parse(this.options.plans[0].startAt);d.each(this.options.plans,function(d,f){var g=c.date.parse(f.startAt);g.getFullYear()==b&&g.getMonth()+1==a&&e.push(f)}),e.length?this.setDayInfo(e):(f<this.curMonth?"next"==this.currentEvent&&this.ahead(-1,0):"next"==this.currentEvent&&this.ahead(1,0),g>=new Date(this.curMonth.getFullYear(),this.curMonth.getMonth(),this.curMonth.getDate())?"prev"==this.currentEvent&&this.ahead(1,0):"prev"==this.currentEvent&&this.ahead(-1,0)),f<new Date(this.curMonth.getFullYear(),this.curMonth.getMonth()+2,this.curMonth.getDate())?this.$next.hide():this.$next.show(),g>=this.curMonth?this.$prev.hide():this.$prev.show()}else this.$next.hide(),this.$prev.hide()},setDayInfo:function(a){var b=this;d("._selected",this.$days).removeClass("_selected"),d.each(a,d.proxy(function(a,c){var e=d('[date="'+c.startAt+'"]',this.$days);e.find(".ui-calendar__day-remain").html("剩余:"+c.discountPrice),e.find(".ui-calendar__day-price").html("￥"+c.originPrice),e.addClass("_selectable").attr("planid",c.id),0==a&&(e.addClass("_selected"),"function"==typeof b.options.callback&&b.options.callback.call(e[0]))},this)),this.bindClickDay()},update:function(a){this.$ipt.val(a),this.$ipt.trigger("change")},ahead:function(a,b){this.selectDate(new Date(this.selectedDate.getFullYear(),this.selectedDate.getMonth()+a,this.selectedDate.getDate()+b))}},a.ui.Calendar=b,b});