var URL = 'http://localhost:8080';
var blockId = window.location.href.toString().split("#")[0].split("/block/")[1].split("?")[0];
var pageId = getQueryVariable("pn")
$(function () {
    initBlock();
    eventHandler();
});

function initBlock() {
    $('#slider').slider();
    wallterFall();
    var username = $.cookie('username');
    if (username == null) {//用户没有登录
        $("#l-no-login").show();
        $("#l-login").hide();
    } else {//用户登录
        $("#l-welcome").empty().append(username);
        $("#l-login").show();
        $("#l-no-login").hide();
    }
    if (isInteger(blockId)&&isInteger(pageId)) {
        $.ajax({
            url: URL + '/api/block/' + blockId + "?pn=" + pageId,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var block = result.data.block;
                var articles = result.data.pageInfo.list;
                $("#nav-block-name").empty().append(block.title);
                $("#block-name").empty().append(block.title);
                $("#block-save-num").empty().append(block.saveNum);
                $("#block-article-num").empty().append(block.articleNum);
                $.each(articles, function (index, article) {
                    createArticleView(index, article);
                });
                if(pageId<=0||pageId>result.data.pageInfo.pages){
                    //todo 页面不存在
                    alert("页面不存在");
                    window.location.href="/user/block/"+blockId+"?pn=1";
                }
                createNavigatePage(result.data.pageInfo);
                $("#jumpButton").click(function(){
                    jumpPn=$("#p-input").val();
                    if(jumpPn<=0||jumpPn>result.data.pageInfo.pages){
                        alert("页面不存在");
                        window.location.href="/user/block/"+blockId+"?pn=1";
                    }else{
                        window.location.href="/user/block/"+blockId+"?pn="+jumpPn;
                    }
                });
            }
        });
    } else {
        //todo 跳转到页面不存在
        alert("页面不存在");
    }
}

function createArticleView(index, article) {
    A_div = $("<div></div>").addClass("list-item");
    A_a = $("<a></a>").addClass("link").attr("href", "/user/article/"+article.id);
    A_div1 = $("<div></div>").addClass("id l");
    if (article.priority == 1) {
        A_div2 = $("<div></div>").addClass("pin").empty().append("置顶").appendTo(A_div1);
    } else {
        A_div1.empty().append(article.id);
    }
    A_div3 = $("<div></div>").addClass("dot l");
    A_div4 = $("<div></div>").addClass("title-cont l");
    A_div5 = $("<div></div>").addClass("title l limit").attr("style", "max-width: 393px;").empty().append(article.title);
    A_div6 = $("<div></div>");
    A_a1 = $("<a></a>").addClass("link");
    A_div7 = $("<div></div>").addClass("author l");
    A_a2 = $("<a></a>").addClass("link").append(article.authorName);
    A_div8 = $("<div></div>").addClass("name limit");
    $("#list-content").append(A_div);
    A_div5.appendTo(A_div4);
    A_div6.append(A_a1).append(article.createTime);
    A_div7.append(A_a2).append(A_div8);
    A_div.append(A_a).append(A_div1).append(A_div3).append(A_div4).append(A_div6).append(A_div7);
}

function createNavigatePage(pageInfo){
       if(!isInteger(pageId)){
           alert("页面不存在");
           window.location.href="/user/block/"+blockId+"?pn=1";
       }
       $("#p-total").empty().append("/ "+pageInfo.pages);
       $("#p-input").attr({"min":1,"max":pageInfo.pages});
       $("#a-nav-index").attr("href","/user/block/"+blockId+"?pn=1");
       $("#a-nav-end").attr("href","/user/block/"+blockId+"?pn="+pageInfo.pages);
       var pns=pageInfo.navigatepageNums;
       for(let i=0;i<10;i++){
           $("#a-nav-"+i).empty().attr("href","/user/block/"+blockId+"?pn="+pns[i]);
           $("#p-nav-"+i).append(pns[i]);
           if(pageId==pns[i]){
               $("#p-nav-"+i).addClass("active")
           }
       }
       $("#a-nav-next").empty().attr("href","/user/block/"+blockId+"?pn="+pageInfo.nextPage);
}


function eventHandler() {
    $("#l-logout").click(function () {
        logout();
    });
}


function logout() {
    var username = $.cookie('username');
    var sessionId = $.cookie(username);
    if (username == null || sessionId == null) {
        alert(username + "尚未登录");
        window.location.href = "/user/index";
        return;
    }
    $.ajax({
        url: URL + "/api/logout",
        type: "post",
        xhrFields: {
            withCredentials: true
        },
        data: {
            username: username,
            sessionId: sessionId,
        },
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    alert(username + '已注销');
                    break;
                case 201:
                    var errorCode = result.errorCode;
                    var reason = result.reason;
                    switch (errorCode) {
                        case 8004:
                            alert(reason);
                            break;
                    }
                    break;
            }
            $.removeCookie(username, {path: '/'});
            $.removeCookie('username', {path: '/'});
            $.removeCookie('JSESSIONID', {path: '/'});
            window.location.href = "/user/index";
        }
    })
}


function wallterFall() {
    var $wallterFall = $('.main-waterfall');
    var $wallterFall_wrap = $wallterFall.find('.main-cont__list');
    var $wallterFall_item = $wallterFall_wrap.find('.item');

    var box_w = 1200;
    var item_w = $wallterFall_item.eq(0).outerWidth();
    var cols = Math.floor(box_w / item_w);
    var height_arr = [];
    var n = 1;


    $wallterFall_item.each(function (i) {
        if (cols > i) {
            height_arr.push($(this).outerHeight());
        } else {
            var min_h = Math.min.apply(null, height_arr);
            var minH_index = $.inArray(min_h, height_arr);

            if (i === 9 || i === 14) {
                n++;
            }

            $(this).css({position: 'absolute', top: min_h + (n * 20), left: minH_index * item_w + minH_index * 20});

            // height_arr 更新
            height_arr[minH_index] += $wallterFall_item.eq(i).outerHeight();
        }
    });
};

;(function ($, window, document, undefined) {

    var Plugin = function (elem) {
        var self = this;

        this.$oWrapper = elem;
        this.$slider_wrap = this.$oWrapper.find('.slider-wrapper');
        this.$slider_item = this.$slider_wrap.find('.item');
        this.$slider_prev = this.$oWrapper.find('.slider-prev');
        this.$slider_next = this.$oWrapper.find('.slider-next');
        this.$slider_title = this.$oWrapper.find('.slider-title').find('h2');
        this.$slider_author = this.$oWrapper.find('.slider-title').find('span');
        this.$slider_btn = this.$oWrapper.find('.slider-btns').find('.item');

        this.slider_w = this.$oWrapper.width();
        this.slider_len = this.$slider_item.length;
        this.data_title = [];
        this.data_author = [];
        this.b_stop = true;
        this.iNum = 0;
        this.iNum2 = 0;
        this.timer = null;

        this.$slider_item.each(function (i) {
            self.data_title.push($(this).attr('data-title'));
            self.data_author.push($(this).attr('data-author') ? $(this).attr('data-author') : '');
        });
    };

    Plugin.prototype = {
        inital: function () {
            var self = this;

            this.$slider_wrap.css({width: this.slider_len * this.slider_w});

            this.setInfo(0);

            this.$slider_btn.click(function () {
                self.setInfo($(this).index());

                self.iNum = $(this).index();
                self.iNum2 = $(this).index();
            });

            this.$slider_prev.click(function () {
                if (self.b_stop) {
                    self.b_stop = false;

                    if (self.iNum === 0) {
                        self.iNum = self.$slider_item.length - 1;
                    } else {
                        self.iNum--;
                    }

                    self.iNum2--;

                    self.setInfo(self.iNum);
                }
            });

            this.$slider_next.click(function () {
                if (self.b_stop) {
                    self.b_stop = false;

                    if (self.iNum === self.$slider_item.length - 1) {
                        self.iNum = 0;
                    } else {
                        self.iNum++;
                    }

                    self.iNum2++;

                    self.setInfo(self.iNum);
                }
            });

            // 自动播放
            this.autoPlay();

            this.$oWrapper.hover(function () {
                clearInterval(self.timer);
            }, function () {
                self.autoPlay();
            });
        },

        setInfo: function (index) {
            var self = this;

            if (this.iNum2 <= this.slider_len - 1 && this.iNum2 !== -1) { // 普通情况下
                this.$slider_wrap.animate({left: this.slider_w * -index}, function () {
                    self.b_stop = true;
                });
            } else if (this.iNum2 > this.slider_len - 1) { // 最后一张无缝切到第一张
                this.$slider_item.eq(0).css({position: 'relative', left: this.slider_w * this.slider_len});

                this.$slider_wrap.animate({left: -this.slider_w * this.iNum2}, function () {
                    self.b_stop = true;

                    self.iNum2 = 0;
                    self.$slider_item.eq(0).css({position: 'static'});
                    self.$slider_wrap.css({left: 0});
                });
            } else { // 第一张无缝切到最后一张
                this.$slider_item.eq(this.slider_len - 1).css({
                    position: 'relative',
                    left: -this.slider_w * this.slider_len
                });

                this.$slider_wrap.an
                self.b_stop = true;
                this.$slider_wrap.animate({left: -this.slider_w * this.iNum2}, function () {
                    self.iNum2 = self.slider_len - 1;
                    self.$slider_item.eq(self.slider_len - 1).css({position: 'static'});
                    self.$slider_wrap.css({left: (self.slider_len - 1) * -self.slider_w});
                });
            }

            this.$slider_btn.removeClass('item-cur');
            this.$slider_btn.eq(index).addClass('item-cur');

            this.$slider_title.html(this.data_title[index]);
            if (this.data_author[index]) {
                this.$slider_author.html(this.data_author[index]);
            } else {
                this.$slider_author.html('');
            }
        },

        autoPlay: function () {
            var self = this;

            this.timer = setInterval(function () {
                self.$slider_next.click();
            }, 4000);
        },

        constructor: Plugin
    };

    $.fn.slider = function () {
        var plugin = new Plugin(this);

        plugin.inital();
    };

})(jQuery, window, document);