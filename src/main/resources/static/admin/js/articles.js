var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
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
                    if(row.id!=null){//排除全选的checkBox
                    var content = "<input type='checkbox' value="+row.id+">";
                    }
                    return content;
                }
            },
            {"data": "id"},
            {"data": "title"},
            {"data": "authorName"},
            {"data":"createTime"},
            {
            "data":"priority",
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


