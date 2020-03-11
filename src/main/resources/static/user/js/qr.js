var URL = 'http://localhost:8080';
$(function () {
    $("#show-qr-image").hide();
    //生成二维码
    $("#write-qr").click(function () {
        if ($("#qr-content").val() == null || $("#qr-content").val() == "") {
            alert("输入内容不能为空");
            return;
        }
        $.ajax({
            url: URL + '/api/feature/qr',
            type: 'POST',
            data: {
                content: $("#qr-content").val(),
                width: 500,
                height: 500,
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var imgPath = result.data.imgPath;
                $("#show-qr-image").show();
                $("#show-qr-image").attr("src", URL + imgPath);
            }
        });
    });
});