var URL = 'http://localhost:8080';
$(function () {
    initProfile();
    eventHandler();
});

function initProfile() {
    wallterFall();
    var name = $.cookie('name');
    if (name == null) {//用户没有登录
        $("#l-no-login").show();
        $("#l-login").hide();
    } else {//用户登录
        $("#l-welcome").append(name);
        $("#l-login").show();
        $("#l-no-login").hide();
    }
}

function eventHandler() {
    $("#l-logout").click(function () {
        logout();
    });
}


function logout() {
    var name = $.cookie('name');
    var sessionId = $.cookie(name);
    if (name == null || sessionId == null) {
        alert(name + "尚未登录");
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
            name: name,
            sessionId: sessionId,
        },
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    alert(name + '已注销');
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
            $.removeCookie(name, {path: '/'});
            $.removeCookie('name', {path: '/'});
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