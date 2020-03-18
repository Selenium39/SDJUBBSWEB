var URL = 'http://localhost:8080';
var name = $.cookie('name');
var user = null;
var sessionId = $.cookie(name);
$(function () {
    initProfile();
    eventHandler();
});

function initProfile() {
    wallterFall();
    var name = $.cookie('name');
    if (name == null) {//用户没有登录
        $("#l-no-login").show();
        $("#l-login").hide();
    } else {//用户登录
        $("#l-welcome").append(name);
        $("#l-login").show();
        $("#l-no-login").hide();
        showProfile();
    }
}

function eventHandler() {
    $("#l-logout").click(function () {
        logout();
    });
    $("#u-update").click(function () {
        showUpdateUserModal();
    });
    $("#btn_update_user").click(function () {
        updateUser();
    });
}

function showProfile() {
    $.ajax({
        url: URL + "/api/user/" + name,
        type: "get",
        xhrFields: {
            withCredentials: true
        },
        data: {
            name: name,
            sessionId: sessionId,
        },
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    //console.log(result.data.user);
                    user = result.data.user;
                    createProfileView(user);
                    break;

            }
        }
    });
}

function createProfileView(user) {
    console.log(user);
    $("#p-id").attr("value", user.id);
    $("#p-username").attr("value", user.username);
    $("#p-age").attr("value", user.age);
    if (user.gender == 0) {
        $("#p-gender").attr("value", '男');
    } else if (user.gender == 1) {
        $("#p-gender").attr("value", '女');
    } else {
        $("#p-gender").attr("value", '未知');
    }
    $("#p-email").attr("value", user.email);
    $("#p-phone").attr("value", user.phone);
    $("#p-head-picture").attr("src", URL + user.headPicture);
}

function createProfileModalView(user) {
    console.log(user);
    $("#u-id").attr("value", user.id);
    $("#u-username").attr("value", user.username);
    $("#u-age").attr("value", user.age);
    if (user.gender == 0) {
        $("#u-gender-0").attr("checked", "checked");
    } else if (user.gender == 1) {
        $("#u-gender-1").attr("checked", "checked");
    } else {
        $("#u-gender-2").attr("checked", "checked");
    }
    $("#u-email").attr("value", user.email);
    $("#u-phone").attr("value", user.phone);
    $("#u-head-picture").attr("src", URL + user.headPicture);
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
            $("#u-head-picture").attr("src", "" + this.result + "");
        };
    });
}


function logout() {
    var name = $.cookie('name');
    var sessionId = $.cookie(name);
    if (name == null || sessionId == null) {
        alert(name + "尚未登录");
        window.location.href = "/user/index";
        return;
    }
    $.ajax({
        url: URL + "/api/logout",
        type: "post",
        xhrFields: {
            withCredentials: true
        },
        data: {
            name: name,
            sessionId: sessionId,
        },
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    alert(name + '已注销');
                    break;
                case 201:
                    var errorCode = result.errorCode;
                    var reason = result.reason;
                    switch (errorCode) {
                        case 8004:
                            alert(reason);
                            break;
                    }
                    break;
            }
            $.removeCookie(name, {path: '/'});
            $.removeCookie('name', {path: '/'});
            $.removeCookie('JSESSIONID', {path: '/'});
            window.location.href = "/user/index";
        }
    })
}


function wallterFall() {
    var $wallterFall = $('.main-waterfall');
    var $wallterFall_wrap = $wallterFall.find('.main-cont__list');
    var $wallterFall_item = $wallterFall_wrap.find('.item');

    var box_w = 1200;
    var item_w = $wallterFall_item.eq(0).outerWidth();
    var cols = Math.floor(box_w / item_w);
    var height_arr = [];
    var n = 1;


    $wallterFall_item.each(function (i) {
        if (cols > i) {
            height_arr.push($(this).outerHeight());
        } else {
            var min_h = Math.min.apply(null, height_arr);
            var minH_index = $.inArray(min_h, height_arr);

            if (i === 9 || i === 14) {
                n++;
            }

            $(this).css({
                position: 'absolute',
                top: min_h + (n * 20),
                left: minH_index * item_w + minH_index * 20
            });

            // height_arr 更新
            height_arr[minH_index] += $wallterFall_item.eq(i).outerHeight();
        }
    });
};

function showUpdateUserModal() {
    $("#update_user_modal").modal("show");
    createProfileModalView(user);
}

function updateUser() {
    console.log("update user");
    var id = $("#u-id").val();
    console.log("id: " + id);
    var formData = new FormData($("#update_user_form")[0]);
    formData.append("name", name);
    formData.append("sessionId", sessionId)
    $.ajax({
        url: URL + '/api/user/' + id,
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
            window.location.reload();
        }
    });
}