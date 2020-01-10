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