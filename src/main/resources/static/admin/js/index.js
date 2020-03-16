var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting() {
    initCommentCount();
    initMessageCount();
    $("#logout").click(function(){
        logout();
    });
}

function initCommentCount() {
    $.ajax({
        url: URL + '/api/admin/comment/reported/count',
        type: 'GET',
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var reportedCommentCount = result.data.reportedCommentCount;
            $("#reportedCommentCount").empty().append(reportedCommentCount);
        }
    });
}

function initMessageCount() {
    $.ajax({
        url: URL + '/api/admin/feature/message/new/count',
        type: 'GET',
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var newMessageCount = result.data.newMessageCount;
            $("#newMessageCount").empty().append(newMessageCount);
        }
    });
}

function logout() {
    if (name == null || sessionId == null) {
        alert(name + "尚未登录");
        window.location.href = "/admin/login";
        return;
    }
    $.ajax({
        url: URL + "/api/admin/logout",
        type: "get",
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