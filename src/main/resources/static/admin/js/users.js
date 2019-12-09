var URL = 'http://localhost:8080';
$(function () {
    paperSetting()
    initUsers();
});

function paperSetting() {
    $('.table-sort').dataTable({
        "aaSorting": [[1, "desc"]],//默认第几个排序
        "bStateSave": true,//状态保存
        "aoColumnDefs": [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {"orderable": false, "aTargets": [0, 4, 5,6,7,10,11]}// 制定列不参与排序
        ]
    });
}

function initUsers() {
    $.ajax({
        url: URL + '/api/admin/user',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function () {
        }
    });
}