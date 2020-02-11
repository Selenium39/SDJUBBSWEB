var URL = 'http://localhost:8080';
var LOCAL_URL = "http://localhost:8081";
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting();
    paperEvent();
});

function paperSetting() {
    $('.table-sort').dataTable({
        "aaSorting": [[1, "desc"]],//默认第几个排序
        "bStateSave": false,//状态保存
        stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
        "aoColumnDefs": [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {"orderable": false, "aTargets": [0]}// 制定列不参与排序
        ],
        serverSide: true,//启用服务器端分页
        ajax: function (data, callback, settings) {
            $.ajax({
                url: URL + '/api/admin/article',
                type: 'GET',
                data: {
                    name: '' + name,
                    sessionId: '' + sessionId,
                    limit: data.length,
                    page: ((data.start / data.length) + 1),
                    order: data.columns[data.order[0].column].data + " " + data.order[0].dir,
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (result) {
                    var pageInfo = result.data.pageInfo;
                    var returnData = {};
                    $("#totalCount").empty().append(pageInfo.total);
                    //这个值不能相同
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = pageInfo.total;//返回数据全部记录
                    returnData.recordsFiltered = pageInfo.total;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = pageInfo.list;//返回的数据列表
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {//每行回调函数
            //动态设置class属性
            $(nRow).attr("class", "text-c")
        },
        columns: [
            {
                render: function (data, type, row, meta) {
                    if (row.id != null) {//排除全选的checkBox
                        var content = "<input type='checkbox' value=" + row.id + ">";
                    }
                    return content;
                }
            },
            {"data": "id"},
            {"data": "title"},
            {"data": "authorName"},
            {"data": "createTime"},
            {
                "data": "priority",
                render: function (data, type, row, meta) {
                    var content = "";
                    if (data == 0) {
                        content = "<td><span class=\"label label-success radius\">普通</span></td>"
                    } else {
                        content = "<td><span class=\"label label-danger radius\">置顶</span></td>"
                    }
                    return content;
                }
            },
            {
                render: function (data, type, row, meta) {
                    var content = "<td><a id='unuse' style='text-decoration:none' title='修改状态'><i  class='Hui-iconfont'>&#xe631;</i></a> <a id='delete' title='删除'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>";
                    return content;
                }
            },
        ]
    });
}

function paperEvent() {
    var table = $('.table-sort').DataTable();
    //置顶文章
    $('.table-sort').on('click', 'a#unuse', function () {
        //行数据
        var data = table.row($(this).parents('tr')).data();
        var td_status = $(this).parent('td').prev();
        if (data.priority == 0) {
            layer.confirm('确定置顶文章 ' + data.title + '?', {icon: 3, title: '提示'}, function (index) {
                $.ajax({
                    url: URL + '/api/admin/article/' + data.id,
                    type: 'PUT',
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                        "priority": 1,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        td_status.empty().append("<span class=\"label label-danger radius\">置顶</span>");
                        data.status = 1;
                    }
                });
                layer.close(index);
            })
        } else {
            layer.confirm('确定取消置顶文章 ' + data.title + '?', {icon: 3, title: '提示'}, function (index) {
                $.ajax({
                    url: URL + '/api/admin/article/' + data.id,
                    type: 'PUT',
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                        "priority": 0,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        td_status.empty().append("<span class=\"label label-success radius\">普通</span>");
                        data.status = 0;
                    }
                });
                layer.close(index);
            })
        }
    });


    //删除文章
    $('.table-sort').on('click', 'a#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        layer.alert("确定删除文章 " + data.title + "?", {icon: 3, title: '提示'}, function (index) {
            $.ajax({
                url: URL + '/api/admin/article/' + data.id,
                type: 'DELETE',
                data: {
                    name: '' + name,
                    sessionId: '' + sessionId,
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (result) {
                    location.replace(location.href);
                }
            });
            layer.close(index);
        })
    });

    //批量删除
    $("#batchDelete").click(function () {
        var ids = "";
        $.each($('input:checkbox:checked'), function () {
            if ($(this).attr("value") != null) {
                ids += $(this).attr("value") + ","
            }
        });
        ids = ids.substring(0, ids.length - 1);
        var result = confirm("确定进行批量删除?");
        if (result == true) {
            deleteArticleByBatch(ids);
        }
    });
    //新增文章
    $("#addArticle").click(function () {
        location.replace("/admin/md");
    });

}

//批量删除
function deleteArticleByBatch(ids) {
    $.ajax({
        url: URL + '/api/admin/articles',
        type: 'DELETE',
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
            ids: ids
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            location.replace(location.href);
        }
    });
}

