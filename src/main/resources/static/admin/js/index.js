var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting() {
    initCommentCount();
    initMessageCount();
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