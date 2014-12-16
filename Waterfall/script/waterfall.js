(function(doc){
//    u is a shorthand of utils
    var u = {}, WaterFall;

//    The two below is copied from https://github.com/sofish/pen/blob/master/src/pen.js
//    detect type
    u.is = function(thing, type){
        return Object.prototype.toString.call(thing).slice(8, -1) === type;
    };

// copy props from a obj
    u.copy = function(defaults, source) {
        for(var p in source) {
            if(source.hasOwnProperty(p)) {
                var val = source[p];
                defaults[p] = this.is(val, 'Object') ? this.copy({}, val) :
                    this.is(val, 'Array') ? this.copy([], val) : val;
            }
        }
        return defaults;
    };

//    default config of WaterFall;
    u.merge = function(conf){
        var defaults = {
//            the width of each card
            width: 150,
//            the number of columns
            column: 2,
//            how many is the width between columns
            columnGap: 20,
//            the meaning is same as columnGap
            rowGap: 10,
//            should the cards reorder when resize or rotate
            reOrder: true,
//            the wrapper of waterfall
            wrapper: doc.getElementsByTagName('body')[0],
//            card class for style and js control
            cardClass: 'waterfall-card',
//            card column class
            columnClass: 'waterfall-column',
//            card group class
            cardGroupClass: 'waterfall-group',
//            wrapper class
            wrapperClass: 'waterfall-wrapper'
        };
        return u.copy(defaults, conf);
    };

//    add css rules
    u.addCSSRules = function(sheet, rule){
        if(sheet.insertRule) {
            sheet.insertRule(rule, 0);
        } else if(sheet.addRule) {
            sheet.addRule(rule, 0);
        }
    };

//    default url joining
    u.joinUrl = function(baseUrl, page){
        page = page+'.json';
        return baseUrl + page;
    };

//    get a localstorage key
    u.getLocalStorageKey = function(index){
        return 'waterfall-page-'+ index;
    };

//    get the value of offset top plus element height
    u.getToTop = function(element){
        return element.offsetTop + element.clientHeight;
    };

//    checkout the width and the height of a image very quickly.
    u.imgReady = (function () {
        var list = [], intervalId = null,

        // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            },

        // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function (url, ready, curData) {
            var check, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready(img.width, img.height, curData);
                return;
            }

            // 检测图片大小的改变
            width = img.width;
            height = img.height;
            check = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                    ) {
                    ready(newWidth, newHeight, curData);
                    check.end = true;
                }
            };
            check();

            // 加入队列中定期执行
            if (!check.end) {
                list.push(check);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
        };
    })();

    WaterFall = function(conf){
        this.conf = u.merge(conf);
//        add loader
        if(this.conf.ajaxUrl === undefined) {
            console.error('You must add ajaxUrl prop to config object.');
            return;
        }
//        add a card generating function
        if(u.is(this.conf.cardMaker, 'Function')) {
            this.cardMaker = this.conf.cardMaker;
            delete this.conf.cardMaker;
        } else {
            console.error('You must add a cardMaker function for generating a card html node');
            return;
        }

        if(u.is(this.conf.noMoreData, 'Function')) {
            this.noMoreData = this.conf.noMoreData;
            delete this.conf.noMoreData;
        }

//        add url joining
        if(this.conf.joinUrl === undefined) {
            this.joinUrl = u.joinUrl;
        } else {
            this.joinUrl = this.conf.joinUrl;
        }
//        indicate whether have more data to load
        this.haveMoreData = true;
        this.currentIndex = 0;
//        the index of the first visible group
        this.visibleIndex = 0;
//        the index of the last hidden group
        this.hiddenIndex = 0;
        this.groupList = [];
        this.fragments = [];
//        boots up waterfall
        this._boot();
//        add event
        this._addEvent();
        this._hasLoaded = false;
//        load first page
        this._request(this.joinUrl(this.conf.ajaxUrl, this.currentIndex));
    };

//    add events
    WaterFall.prototype._addEvent = function(isRemove){
        var that = this;
        var baseUrl = this.conf.ajaxUrl;
        var oldScroll = 0;
        var newScroll;
        var handler = function(){
            if(that._hasLoaded === false) {
                return;
            }
            newScroll = window.scrollY;
            that._watchScroll(oldScroll, newScroll);
            oldScroll = newScroll;
//            when scroll to bottom
            if(that.haveMoreData && newScroll + window.innerHeight >= u.getToTop(that.conf.wrapper)-150){
                //        forbid sending request again
                that._hasLoaded = false;
                that.currentIndex += 1;
                that._request(that.joinUrl(baseUrl, that.currentIndex));
            }
        };
        window.addEventListener('scroll', handler);
    };

//    boot up waterfall
    WaterFall.prototype._boot = function(){
        this._initElement();
        this._initStyle();
    };

    WaterFall.prototype._initElement = function(){
        var wrapper = this.conf.wrapper;
        if(u.is(wrapper, 'String')){
            this.conf.wrapper = wrapper = doc.querySelector(wrapper);
        }
        wrapper.className += ' '+this.conf.wrapperClass;
    };

    /*
    * set the style of the wrapper and cards,
    * set the width of cards by insert css rules the the first stylesheet.
    * */
    WaterFall.prototype._initStyle = function(){
        var sheet = doc.styleSheets[0];
        var columnNum = this.conf.column;
        var columnGap = this.conf.columnGap;
        var rowGap = this.conf.rowGap;
        var cardWidth = this.conf.width;
        var groupWidth = (cardWidth+columnGap) * columnNum;

//        css style for cards
        var cardRule = '.'+this.conf.wrapperClass+' .'+this.conf.cardClass;
        cardRule += '{' +
            'margin-top:' +rowGap +'px;'+
            'width:'+cardWidth+'px;'+
            '}';

//        css style for columns
        var columnRule = '.'+this.conf.wrapperClass+' .'+this.conf.columnClass;
        columnRule += '{' +
            'display: inline-block;' +
            'vertical-align: top;' +
            'width:' + cardWidth+'px;'+
            'margin-left: '+columnGap+'px;' +
            '}' ;

//        card group style
        var groupRule = '.'+this.conf.wrapperClass+' .'+this.conf.cardGroupClass;
        groupRule += '{'+
            'width:'+groupWidth+'px;' +
            'margin-left:'+(-columnGap)+'px'+
            '}';
//        clear float
        var clearFloatRule = '.'+this.conf.wrapperClass+' .'+this.conf.cardGroupClass+':after' +
            '{' +
            'content:"";' +
            'display:block;' +
            'clear:both;' +
            '}';

//        css style for wrapper
        var wrapperRule = '.'+this.conf.wrapperClass;
        wrapperRule += '{' +
            'margin-top: '+(-rowGap)+'px;' +
            'box-sizing: border-box; ' +
            '-webkit-box-sizing: border-box;' +
            '}';

        u.addCSSRules(sheet, cardRule);
        u.addCSSRules(sheet, columnRule);
        u.addCSSRules(sheet, groupRule);
        u.addCSSRules(sheet, clearFloatRule);
        u.addCSSRules(sheet, wrapperRule);
    };

//    ajax function
    WaterFall.prototype._request = function (url, method, data) {
        var key = u.getLocalStorageKey(this.currentIndex);
        var cacheJson = localStorage.getItem(key);
        if(cacheJson != null) {
            this._loader(JSON.parse(cacheJson));
            return;
        }

        var xhr = new XMLHttpRequest();
        var that = this;
        if(method === undefined) {
            method ='GET';
        }
        xhr.open(method.toUpperCase(), url, true);
        data !== undefined ? xhr.send(data) : xhr.send();
        xhr.addEventListener('readystatechange', function(){
            var json;
            if(xhr.readyState === 4){
                if(xhr.status === 200) {
                    json = xhr.responseText;
                    localStorage.setItem(key, json);
                    that._loader(JSON.parse(json));
                }
                else if(xhr.status === 404) {
                    that._hasLoaded = true;
                    that.haveMoreData = false;
                    that.noMoreData && that.noMoreData();
                } else {
                    that._hasLoaded = true;
                    console.error('request error: '+xhr.status);
                }
            }
        });
    };

//    get the shortest column
    WaterFall.prototype._getExtreme = function(group){
        var columns = group.getElementsByClassName(this.conf.columnClass);
        var min= u.getToTop(columns[0]);
        var temp;
        var resultColumn;
        for(var i=1; i<columns.length; i++){
            temp = u.getToTop(columns[i]);
            if(temp < min) {
                min = temp;
                resultColumn = columns[i];
            }
        }
        return resultColumn !== undefined ? resultColumn : columns[0];
    };

//    structure a card
    WaterFall.prototype._cardStructure = function(){
        var group = document.createElement('div');
        var fragment = document.createDocumentFragment();
        var column = document.createElement('div');
        this.groupList.push(group);
        if(this.currentIndex > 0) {
            var prevGroup = this.groupList[this.currentIndex-1];
            var prevGroupBottom = u.getToTop(prevGroup);
            var prevColumns = prevGroup.getElementsByClassName(this.conf.columnClass);
        }
        column.className = this.conf.columnClass;
        group.className = this.conf.cardGroupClass;
        for(var i=0; i<this.conf.column; i++) {
            column = column.cloneNode();
            if(prevColumns!==undefined) {
                column.style.marginTop = u.getToTop(prevColumns[i])-prevGroupBottom + 'px';
            }
            fragment.appendChild(column);
        }
        group.appendChild(fragment);
        this.conf.wrapper.appendChild(group);
        return group;
    };

//    generate a card group
    WaterFall.prototype._cardMaker = function(width, height, curData, group){
        var realHeight = height * this.conf.width/width;
        var outerCard = document.createElement('div');
        var innerCard = this.cardMaker(curData);
        var shortestColumn = this._getExtreme(group);
        innerCard.getElementsByTagName('img')[0].style.height = realHeight + 'px';
        outerCard.className = this.conf.cardClass;
        outerCard.appendChild(innerCard);
        shortestColumn.appendChild(outerCard);
    };

//    loader
    WaterFall.prototype._loader = function(data){
        var that = this;
        var group = this._cardStructure();
//        when the width and height of a image loaded
        var imgReady = function(imgWidth, imgHeight, curData) {
            that._cardMaker(imgWidth, imgHeight, curData, group);
            group._loaded===undefined ? group._loaded = 1 : group._loaded += 1;
            if(group._loaded === data.length) {
                group.style.height = group.clientHeight + 'px';
                that._hasLoaded = true;
            }
        };
        for(var i=0; i<data.length; i++){
            (function(){
                var curData = data[i];
                (function(){
                    u.imgReady(curData.img, imgReady, curData);
                })();
            })();
        }
    };

//    watch the direction of scrolling
    WaterFall.prototype._watchScroll = function(oldScroll, newScroll){
        var visibleGroup;
        var hiddenGroup;
        var visibleArea;

        if(oldScroll < newScroll) {
            visibleGroup = this.groupList[this.visibleIndex+1];
            if(visibleGroup === undefined) {
                return;
            }
            visibleArea = u.getToTop(visibleGroup) - newScroll;
            hiddenGroup = this.groupList[this.visibleIndex];
//            when the visible area is less than half
            if(visibleArea < visibleGroup.clientHeight/2) {
                if (hiddenGroup._isHidden === true) {
                    return;
                }
                hiddenGroup._isHidden = true;
                this._removeColumns(hiddenGroup);
                this.visibleIndex + 1 > this.currentIndex ?
                    this.visibleIndex  = this.currentIndex : this.visibleIndex+=1;
                this.hiddenIndex = this.visibleIndex -1;
            }
        } else if(oldScroll > newScroll) {
            visibleGroup = this.groupList[this.hiddenIndex+1];
            visibleArea = u.getToTop(visibleGroup) - newScroll;
            hiddenGroup = this.groupList[this.hiddenIndex];
//            when the visible area is larger than half
            if(visibleArea > visibleGroup.clientHeight/2) {
                if (hiddenGroup._isHidden === false) {
                    return;
                }
                hiddenGroup._isHidden = false;
                this._recoverColumns(hiddenGroup);
                this.hiddenIndex -= 1;
                this.visibleIndex = this.hiddenIndex + 1;
                if(this.hiddenIndex < 0) {
                    this.hiddenIndex = 0;
                }
            }
        }
//        console.log('hiddenIndex: '+this.hiddenIndex);
//        console.log('visibleIndex: '+this.visibleIndex);
    };
    
//    recover columns
    WaterFall.prototype._recoverColumns = function(group){
        var frag = this.fragments.pop();
        group.appendChild(frag);
    };
//    cut columns
    WaterFall.prototype._removeColumns = function(group){
        var frag = document.createDocumentFragment();
        var columns = group.getElementsByClassName(this.conf.columnClass);
        while(columns.length > 0) {
            frag.appendChild(group.removeChild(columns[0]));
        }
        this.fragments.push(frag);
    };
//    export waterfall to the oengine name space
    window.OE = window.OE || {};
    window.OE.waterfall = WaterFall;
})(document);