var URL = 'http://localhost:8080';
$(function () {
    var signUpButton = document.getElementById('signUp')
    var signInButton = document.getElementById('signIn')
    var container = document.getElementById('dowebok')
    signUpButton.addEventListener('click', function () {
        container.classList.add('right-panel-active')
    })

    signInButton.addEventListener('click', function () {
        container.classList.remove('right-panel-active')
    })
    jQuery.validator.addMethod("usernameCheck", function (value, element) {
        var regExpStr = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        return regExpStr.test(value);
    }, "昵称只支持中文、英文、数字");

    $("#btn-login").click(function () {
        $.ajax({
            url: URL + "/api/login",
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: {
                "username": $("#l-username").val(),
                "password": formEncryption($("#l-password").val()),
            },
            success: function (result) {
                var status = result.code;
                var username = result.data.username;
                var sessionId = result.data.sessionId;
                $("#l-username-error").remove();
                $("#l-password-error").remove();
                switch (status) {
                    case 200:
                        $.cookie('username', username, {expires: 7, path: '/'});
                        $.cookie(username, sessionId, {expires: 7, path: '/'});
                        window.location.href = '/user/index';
                        break;
                    case 201:
                        $("#l-username-error").remove();
                        $("#l-password-error").remove();
                        var errorCode = result.errorCode;
                        var reason = result.reason;
                        var usernameErrorLabel = $("<label id='l-username-error' class='error' for='l-username'></label>")
                        var passwordErrorLabel = $("<label id='l-password-error' class='error' for='l-password'></label>")
                        switch (errorCode) {
                            case 8001:
                                usernameErrorLabel.append(reason);
                                $("#l-username").after(usernameErrorLabel);
                                break;
                            case 8002:
                                passwordErrorLabel.append(reason);
                                $("#l-password").after(passwordErrorLabel);
                                break;
                            case 8003:
                                alert("此用户被禁用");
                                break;
                            default:
                                alert("登录失败");
                                break;
                        }
                        break;
                    default:
                        alert("登录失败");
                        break;
                }
            }
        });
        return false;
    });

    $("#btn-register").click(function () {
        $("#r-form").validate({
            submitHandler: function () {
                $.ajax({
                    url: URL + "/api/register",
                    type: "POST",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        username: $("#r-username").val(),
                        email: $("#r-email").val(),
                        password: formEncryption($("#r-password").val()),
                    },
                    success: function (result) {
                        var status = result.code;
                        switch (status) {
                            case 200:
                                alert("注册成功");
                                window.location.href = "/user/login";
                                break;
                            case 201:
                                $("#r-username-error").remove();
                                $("#r-email-error").remove();
                                $("#r-password-error").remove();
                                var errorCode = result.errorCode;
                                var reason = result.reason;
                                var usernameErrorLabel = $("<label id='r-username-error' class='error' for='r-username'></label>")
                                var emailErrorLabel = $("<label id='r-email-error' class='error' for='r-email'></label>")
                                switch (errorCode) {
                                    case 9001:
                                        usernameErrorLabel.append(reason);
                                        $("#r-username").after(usernameErrorLabel);
                                        break;
                                    case 9002:
                                        emailErrorLabel.append(reason);
                                        $("#r-email").after(emailErrorLabel);
                                        break;
                                }
                                break;
                            default:
                                alert("注册失败");
                                break;
                        }
                    }
                });
                return false;
            },
            rules: {
                username: {
                    required: true,
                    minlength: 4,
                    maxlength: 12,
                    usernameCheck: true,
                },
                email: {
                    required: true,
                    email: true,
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: "昵称不能为空",
                    minlength: "昵称不能低于4个字符",
                    maxlength: "昵称不能超过12个字符",
                },
                email: {
                    required: "邮箱不能为空",
                    email: "邮箱格式不正确"
                },
                password: {
                    required: "密码不能为空",
                }
            },

        });
    });
});

