var URL = 'http://localhost:8080';
window.onload = function () {
    var oWrap = document.getElementsByClassName("wrap")[0];
    var oTextarea = oWrap.getElementsByTagName("textarea")[0];
    var oBtn = oWrap.getElementsByTagName("input")[0];
    var oUl = oWrap.getElementsByTagName("ul")[0];
    var errMsg = oWrap.getElementsByClassName("errmsg")[0];
    var oA = document.getElementsByTagName("a");
    initMessage();
    oBtn.onclick = function () {
        if (oTextarea.value == "") {
            startMove(errMsg, {opacity: 100});
            //console.log(errMsg.style.opacity)
            oTextarea.select();
        } else {
            uploadMessage(oTextarea.value);
        }
    };

    function initMessage() {
        $.ajax({
            url: URL + '/api/feature/message',
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var messages = result.data.messages;
                $.each(messages, function (index, message) {
                    createMessage(message.content, message.time);
                });
            }
        });
    }

    function createMessage(value, timer) {
        var aLi = document.createElement("li");
        var aSpan = document.createElement("span");
        aLi.innerHTML = value;
        aSpan.innerHTML = timer;
        if (oUl.children.length > 0) {
            oUl.insertBefore(aLi, oUl.children[0]);
            aLi.appendChild(aSpan);
            oTextarea.value = "";
        } else {
            oUl.appendChild(aLi);
            aLi.appendChild(aSpan);
            oTextarea.value = "";
        }
        var aLiHeight = parseInt(getStyle(aLi, "height"));
        //console.log(aLiHeight);
        aLi.style.height = "0";
        startMove(aLi, {height: aLiHeight}, function () {
            startMove(aLi, {opacity: 100});
        });
    }

    function uploadMessage(content) {
        $.ajax({
            url: URL + '/api/feature/message',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {
                content: content
            },
            success: function (result) {
                var message = result.data.message;
                console.log(message.content);
                console.log(message.time);
                createMessage(message.content, message.time);
            }
        });
    }

    function delLi() {
        for (var i = 0; i < oA.length; i++) {
            oA[i].onclick = function () {
                liNode = this.parentNode.parentNode//获取到当前A标签的父节点，也就是LI
                var aLiHeight = parseInt(getStyle(liNode, "height")) + 1;
                //console.log(aLiHeight);
                //链式运动操作：先进行透明化，再进行高度变小，最后删除DOM元素
                startMove(liNode, {opacity: 0}, function () {
                    startMove(liNode, {height: 0}, function () {
                        oUl.removeChild(liNode);
                    });
                });
            }
        }
    }
};

//运动框架
function startMove(obj, json, endFn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(
        function () {

            var iStop = true;
            for (var curr in json) {
                var oNumber = 0;
                if (curr == "opacity") {
                    oNumber = Math.round(parseFloat(getStyle(obj, curr)) * 100);
                } else {
                    oNumber = parseInt(getStyle(obj, curr));
                }
                var speed = (json[curr] - oNumber) / 6;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if (oNumber != json[curr])
                    iStop = false;
                if (curr == "opacity") {
                    obj.style.filter = "alpha(opacity:" + (oNumber + speed) + ")";
                    obj.style.opacity = (oNumber + speed) / 100;
                } else {
                    obj.style[curr] = oNumber + speed + "px";
                }
            }
            ;
            if (iStop) {
                clearInterval(obj.timer);
                if (endFn) endFn();
            }
        }, 30);
};

//获取非行间样式
function getStyle(obj, name) {
    if (obj.currentStyle) {
        obj = currentStyle[name];
    } else {
        obj = getComputedStyle(obj, false)[name];
    }
    return obj;
};
