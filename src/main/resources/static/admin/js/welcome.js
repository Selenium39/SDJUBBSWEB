var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting(){
    showServerSystemInfo();
}

function showServerSystemInfo(){
    $.ajax({
        url: URL + '/api/admin/server/system/info',
        type: 'GET',
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            let systemInfo=result.data.systemInfo;
            $.each(systemInfo,function(key,value){
                $("#"+key).empty().append(value);
            });
        }
    });
}




