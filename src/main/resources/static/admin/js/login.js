var URL = 'http://localhost:8080';
var recordId = "";
$(function () {
    getVerifyCode();
    paperEvent()
});

function paperEvent() {
    $("#refresh").click(function () {
        getVerifyCode();
    });
    $("#login").click(function () {
        login();
        return;
    });
}

function getVerifyCode() {
    $.ajax({
        url: URL + '/api/admin/code/',
        type: 'GET',
        data: {
            width: 180,
            height: 50,
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var image = result.data.img;
            recordId = result.data.recordId;
            if (image != null && recordId != null) {
                $("#verify-code").attr("src", URL + image + ".png");
                $.cookie('recordId', recordId, {expires: 7, path: '/'});
            }
        }
    });
}

function login() {
    $.ajax({
        url: URL + '/api/admin/login/',
        type: 'POST',
        data: {
            username: $("#username").val(),
            password: formEncryption($("#password").val()),
            verifyCode: $("#verifyCode").val(),
            recordId: $.cookie("recordId")
        },
        xhrFields: {
            withCredentials: true
        }
        ,
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    var sessionId = result.data.sessionId;
                    var username = result.data.username;
                    console.log(sessionId)
                    $.cookie('name', username, {expires: 7, path: '/'});
                    $.cookie(username, sessionId, {expires: 7, path: '/'});
                    window.location.href = '/admin/index';
                    break;
                case 201:
                    var errorCode = result.errorCode;
                    var reason = result.reason;
                    switch (errorCode) {
                        case 4001:
                            alert(reason);
                            $("#verifyCode").val("");
                            getVerifyCode();
                            break;
                    }
                    break;
            }
        }
    })
    ;
}