var URL = 'http://localhost:8080';
$(function () {
    paperSetting()
});

function paperSetting() {
    $('.table-sort').dataTable({
        "aaSorting": [[1, "desc"]],//默认第几个排序
        "bStateSave": true,//状态保存
        stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
        "aoColumnDefs": [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {"orderable": false, "aTargets": [0, 4, 5, 6, 7, 10, 11]}// 制定列不参与排序
        ],
        serverSide: true,//启用服务器端分页
        ajax: function (data, callback, settings) {
            console.log(data);
            $.ajax({
                url: URL + '/api/admin/user',
                type: 'GET',
                data: {
                    limit: data.length,
                    page: data.draw,
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (result) {
                    var pageInfo = result.data.pageInfo;
                    var returnData = {};
                    $("#totalCount").empty().append(pageInfo.total);
                    returnData.draw = pageInfo.pageNum;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = pageInfo.total;//返回数据全部记录
                    returnData.recordsFiltered = pageInfo.total;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = pageInfo.list;//返回的数据列表
                    //console.log(returnData);
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
                    var content = "<input type='checkbox'>";
                    return content;
                }
            },
            {"data": "id"},
            {"data": "username"},
            {"data": "age"},
            {"data": "gender"},
            {"data": "email"},
            {"data": "phone"},
            {"data": "headPicture"},
            {"data": "registerTime"},
            {"data": "lastLoginTime"},
            {
                "data": "status",
                render: function (data, type, row, meta) {
                    var content = "";
                    if (data == 0) {
                        content = "<td><span class=\"label label-success radius\">有效</span></td>"
                    } else {
                        content = "<td><span class=\"label label-danger radius\">禁用</span></td>"
                    }
                    return content;
                }

            },
            {
                render: function (data, type, row, meta) {
                    var content = "<td class='td-manage'><a style='text-decoration:none' title='停用'><i class='Hui-iconfont'>&#xe631;</i></a> <a title='编辑'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6df;</i></a> <a style='text-decoration:none' class='ml-5'  title='修改密码'><i class='Hui-iconfont'>&#xe63f;</i></a> <a title='删除'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>";
                    return content;
                }
            }
        ]
    }).api();
}

// function initUsers() {
//     $.ajax({
//         url: URL + '/api/admin/user',
//         type: 'GET',
//         xhrFields: {
//             withCredentials: true
//         },
//         success: function (result) {
//             var users = result.data.users;
//             alert(users.length);
//             $.each(users, function (index, user) {
//                // createUserView(index, user);
//             });
//         }
//     });
// }
// <tr class="text-c">
//     <td width="25"><input type="checkbox" name="" value=""></td>
//     <td>16</td>
//     <td>selenium</td>
//     <td>0</td>
//     <td>未知</td>
//     <td>895484122@qq.com</td>
// <td>18888888888</td>
// <td>/common/images/0.jpg</td>
// <td>2019-09-05 00:46:29</td>
// <td>2019-09-05 00:46:29</td>
// <td><span class="label label-success radius">有效</span></td>
// <td class="td-manage"><a style="text-decoration:none" title="停用"><i class="Hui-iconfont">&#xe631;</i></a> <a title="编辑"  class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a> <a style="text-decoration:none" class="ml-5"  title="修改密码"><i class="Hui-iconfont">&#xe63f;</i></a> <a title="删除"  class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a></td>
// </tr>
