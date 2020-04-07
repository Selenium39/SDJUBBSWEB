let URL = "ws:localhost:8080";
$(function () {
    let name = prompt("请输入您的昵称");
    if (name == null || name == "") {
        return;
    }
    let socket = new WebSocket(URL + "/api/chat/" + name + "/" + uuidv4());
    socket.onopen = function () {

    };
    socket.onmessage = function (msg) {
        var result = JSON.parse(msg.data);
        if (null != result.count) {
            $("#count").empty().append("在线人数: " + result.count);
        }
        if (null != result.message && null != result.time && null != result.name) {
            //<div style="color:green">你 16:37:33</div>等待服务器Websocket握手包...-->
            var section = $("<div></div>").css("margin-bottom", "10px");
            $("#message-list").append(section);
            var element = $("<div></div>");
            element.css("color", name == result.name ? "green" : "blue").empty().append(result.name + "&nbsp;&nbsp;" + result.time);
            section.append(element);
            element.after(result.message);
            console.log(result.message)
        }

    };
    socket.onclose = function () {
    };
    socket.onerror = function () {
    }

    $("#btn_send").click(function () {
        socket.send($("#message").val());
        $("#message").val('');
    });
});