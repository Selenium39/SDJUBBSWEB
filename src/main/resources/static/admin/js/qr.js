var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperEvent();
});

function paperEvent() {
    $("#d-qr").click(function () {
        $.ajax({
            url: URL + '/api/admin/feature/qr',
            type: 'DELETE',
            data: {
                name: '' + name,
                sessionId: '' + sessionId,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var status = result.code;
                if (status == 200) {
                    alert("删除成功");
                }
            }
        });
    });
}





