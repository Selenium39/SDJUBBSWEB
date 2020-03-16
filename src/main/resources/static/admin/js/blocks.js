var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
    paperEvent();
});

function paperSetting() {
    $('.table-sort').dataTable({
        "aaSorting": [[1, "desc"]],//默认第几个排序
        "bStateSave": true,//状态保存
        "searching":false,//搜索框
        "bProcessing": true,
        stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
        "aoColumnDefs": [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {"orderable": false, "aTargets": [0,5,9]}// 制定列不参与排序
        ],
        serverSide: true,//启用服务器端分页
        ajax: function (data, callback, settings) {
            $.ajax({
                url: URL + '/api/admin/block',
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
            {"data": "authorId"},
            {"data": "authorName"},
            {
                "data": "blockPicture",
                render: function (data, type, row, meta) {
                    var content = "";
                    content = '<img id="pix" style="width:50px;height:50px;border-radius:50%" src="' + this.URL + data + '"/>';
                    return content;
                }
            },
            {"data": "articleNum"},
            {"data": "saveNum"},
            {"data": "createTime"},
            {
                render: function (data, type, row, meta) {
                    var content = "<td> <a title='编辑' id='edit'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6df;</i></a> <a id='delete' title='删除'  class='ml-5' style='text-decoration:none'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>";
                    return content;
                }
            }
        ]
    });
}

function paperEvent() {
    var table = $('.table-sort').DataTable();

    //新增板块
    $("#addBlock").click(function () {
        $("#add_block_modal").modal("show");
        //设置默认封面
        var imgSrc = URL + "/common/images/avatar/default.jpg";
        $("#add_block_picture").attr("src", imgSrc);
        //预览上传的封面
        $("#add_block_picture_file").change(function (e) {
            var reader = new FileReader();
            file = e.target.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert("上传的文件格式不对,请重新上传...");
                return false;
            }
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $("#add_block_picture").attr("src", "" + this.result + "");
            };
        });
    });


    $("#btn_add_block").click(function () {
        var formData = new FormData($("#add_block_form")[0]);
        formData.append("name", name);
        formData.append("sessionId", sessionId)
        $.ajax({
            url: URL + '/api/admin/block/',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                $("#add_block_modal").modal("hide");
                location.replace(location.href);
            }
        });
    });

    //修改板块
    $('.table-sort').on('click', 'a#edit', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data);
        $("#update_block_modal").modal("show");
        //修改用户数据前的表单回显
        showUpdateBlock(data);
    });
    $("#btn_update_block").click(function () {
        updateBlock();
    });
}

function showUpdateBlock(data) {
    $("#id").empty().append(data.id);
    $("#title").attr("value", data.title);
    $("#block_picture").attr("src", "" + URL + data.blockPicture + "");
    //预览上传的封面
    $("#block_picture_file").change(function (e) {
        var reader = new FileReader();
        file = e.target.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("上传的文件格式不对,请重新上传...");
            return false;
        }
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            $("#block_picture").attr("src", "" + this.result + "");
        };
    });
}

function updateBlock() {
    var id = $("#id").text();
    var formData = new FormData($("#update_block_form")[0]);
    formData.append("name", name);
    formData.append("sessionId", sessionId)
    $.ajax({
        url: URL + '/api/admin/block/' + id,
        type: 'PUT',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            $("#update_block_modal").modal("hide");
            location.replace(location.href);
        }
    });
}


