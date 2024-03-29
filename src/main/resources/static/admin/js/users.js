var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
    paperEvent();
    search();
});

function search(){
var searchInput=$("#DataTables_Table_0_filter input");
searchInput.bind('keydown',function(event){
    if(event.keyCode == "13") {
        console.log(searchInput.val())
               let searchContent = searchInput.val()
               if(searchContent == ''||searchContent == null || searchContent == undefined){
                  return ;
               }else{
                $(".table-sort").dataTable().fnDestroy();
               //查询
               show(searchContent);
               }
    }
});
}

function paperSetting() {
//清空搜索框内容
$("#DataTables_Table_0_filter input").empty();
  //显示所有
  show(null);
}

function show(searchContent){
       $('.table-sort').dataTable({
           "aaSorting": [[1, "desc"]],//默认第几个排序
           "bStateSave": true,//状态保存
           "searching":true,//搜索框
           "bProcessing": true,
           stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
           "aoColumnDefs": [
               //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
               {"orderable": false, "aTargets": [0, 4, 5, 6, 7, 11]}// 制定列不参与排序
           ],
           serverSide: true,//启用服务器端分页
           ajax: function (data, callback, settings) {
               $.ajax({
                   url: searchContent == null ? URL + '/api/admin/user':URL + '/api/admin/user?search='+searchContent,
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
               {"data": "username"},
               {"data": "age"},
               {
                   "data": "gender",
                   render: function (data, type, row, meta) {
                       var content = "";
                       if (data == 0) {
                           content = "<td>男</td>"
                       } else if (data == 1) {
                           content = "<td>女</td>"
                       } else {
                           content = "<td>未知</td>"
                       }
                       return content;
                   }
               },
               {"data": "email"},
               {"data": "phone"},
               {
                   "data": "headPicture",
                   render: function (data, type, row, meta) {
                       var content = "";
                       content = '<img id="pix" style="width:50px;height:50px;border-radius:50%" src="' + this.URL + data + '"/>';
                       return content;
                   }

               },
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
                       var content = "<td><a id='unuse' style='text-decoration:none' title='修改状态'><i  class='Hui-iconfont'>&#xe631;</i></a> <a title='编辑' id='edit'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6df;</i></a> <a id='change-password' style='text-decoration:none' class='ml-5'  title='修改密码'><i class='Hui-iconfont'>&#xe63f;</i></a> <a id='delete' title='删除'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>";
                       return content;
                   }
               }
           ]
       });
}

function paperEvent() {
    var table = $('.table-sort').DataTable();
    //禁用和启用用户
    $('.table-sort').on('click', 'a#unuse', function () {
         console.log(data);
        //行数据
        var data = table.row($(this).parents('tr')).data();
        var td_status = $(this).parent('td').prev();
        if (data.status == 0) {
            layer.confirm('确定禁用用户 ' + data.username + '?', {icon: 3, title: '提示'}, function (index) {
                $.ajax({
                    url: URL + '/api/admin/user/' + data.id,
                    type: 'PUT',
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                        "status": 1,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        td_status.empty().append("<span class=\"label label-danger radius\">禁用</span>");
                        data.status = 1;
                    }
                });
                layer.close(index);
            })
        } else {
            layer.confirm('确定启用用户 ' + data.username + '?', {icon: 3, title: '提示'}, function (index) {
                $.ajax({
                    url: URL + '/api/admin/user/' + data.id,
                    type: 'PUT',
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                        "status": 0,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        td_status.empty().append("<span class=\"label label-success radius\">有效</span>");
                        data.status = 0;
                    }
                });
                layer.close(index);
            })
        }
    })

    //删除用户
    $('.table-sort').on('click', 'a#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        layer.alert("确定删除用户 " + data.username + "?", {icon: 3, title: '提示'}, function (index) {
            $.ajax({
                url: URL + '/api/admin/user/' + data.id,
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

    //修改用户
    $('.table-sort').on('click', 'a#edit', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data);
        $("#update_user_modal").modal("show");
        //修改用户数据前的表单回显
        showUpdateUser(data);
    });
    $("#btn_update_user").click(function () {
        updateUser();
    });
    //修改密码
    $('.table-sort').on('click', 'a#change-password', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data);
        $("#change_password_modal").modal("show");
        $("#p-id").empty().append(data.id);
    });
    $("#btn_change_password").click(function () {
        changePassword();
    });
    //新增用户
    $("#addUser").click(function () {
        $("#add_user_modal").modal("show");
        //设置默认头像
        var imgSrc = URL + "/common/images/avatar/default.jpg";
        $("#add_head_picture").attr("src", imgSrc);
        //预览上传的头像
        $("#add_head_picture_file").change(function (e) {
            var reader = new FileReader();
            file = e.target.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert("上传的文件格式不对,请重新上传...");
                return false;
            }
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $("#add_head_picture").attr("src", "" + this.result + "");
            };
        });
    });
    //批量删除
    $("#batchDelete").click(function(){
        var ids="";
        $.each($('input:checkbox:checked'),function(){
           if($(this).attr("value")!=null){
           ids+=$(this).attr("value")+","
           }
        });
         ids=ids.substring(0,ids.length-1);
         var result=confirm("确定进行批量删除?");
         if(result==true){
         deleteUserByBatch(ids);
         }
    });

    $("#btn_add_user").click(function () {
        var formData = new FormData($("#add_user_form")[0]);
        formData.append("name", name);
        formData.append("sessionId", sessionId)
        formData.append("password",formEncryption($("#add_password").val()))
        $.ajax({
            url: URL + '/api/admin/user/',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                $("#add_user_modal").modal("hide");
                location.replace(location.href);
            }
        });
    });
}

function showUpdateUser(data) {
    $("#id").empty().append(data.id);
    $("#username").attr("value", data.username);
    $("#age").attr("value", data.age);
    genderSelect(data.gender)
    $("#email").attr("value", data.email);
    $("#phone").attr("value", data.phone);
    $("#head_picture").attr("src", "" + URL + data.headPicture + "");
    //预览上传的头像
    $("#head_picture_file").change(function (e) {
        var reader = new FileReader();
        file = e.target.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("上传的文件格式不对,请重新上传...");
            return false;
        }
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            $("#head_picture").attr("src", "" + this.result + "");
        };
    });
}

function genderSelect(gender) {
    switch (gender) {
        case 0:
            $("#gender_male").attr("checked", "checked");
            break;
        case 1:
            $("#gender_female").attr("checked", "checked");
            break;
        case 2:
            $("#gender_unknown").attr("checked", "checked");
            break;
        default:
            $("#gender_unknown").attr("checked", "checked");
            break;
    }
}

function updateUser() {
    console.log("update user");
    var id = $("#id").text();
    console.log("id: " + id);
    var formData = new FormData($("#update_user_form")[0]);
    formData.append("name", name);
    formData.append("sessionId", sessionId)
    $.ajax({
        url: URL + '/api/admin/user/' + id,
        type: 'PUT',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            $("#update_user_modal").modal("hide");
            location.replace(location.href);
        }
    });
}

function changePassword() {
    var id = $("#p-id").text();
    if ($("#password1").val() != $("#password2").val()) {
        alert("密码不一致");
        return;
    }
    console.log('name: ' + name);
    console.log('sessionId: ' + sessionId);
    $.ajax({
        url: URL + '/api/admin/user/' + id,
        type: 'PUT',
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
            password: formEncryption($("#password1").val())
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            $("#change_password_modal").modal("hide");
            location.replace(location.href);
        }
    });
}

function deleteUserByBatch(ids){
       $.ajax({
             url: URL + '/api/admin/users',
             type: 'DELETE',
             data: {
                 name: '' + name,
                 sessionId: '' + sessionId,
                 ids:ids
             },
             xhrFields: {
                 withCredentials: true
             },
             success: function (result) {
                 location.replace(location.href);
             }
         });
}