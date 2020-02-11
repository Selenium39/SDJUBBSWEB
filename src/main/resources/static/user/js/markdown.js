var testEditor;
var URL = 'http://localhost:8080';
var LOCAL_URL = "http://localhost:8081";
var name = $.cookie('name');
var sessionId = $.cookie(name);

$(function () {
    testEditor = editormd("my-editormd", {
        placeholder: '本编辑器支持Markdown编辑，左边编写，右边预览',
        width: "90%",
        height: document.body.clientHeight - 90,
        syncScrolling: "single",
        path: "/common/editor.md/lib/",
        saveHTMLToTextarea: true,
        tocm: true, // Using [TOCM]
        tex: true, // 开启科学公式TeX语言支持，默认关闭
        flowChart: true, // 开启流程图支持，默认关闭
        sequenceDiagram: true, // 开启时序/序列图支持，默认关闭
        imageUpload: true,
        crossDomainUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: LOCAL_URL + "/api/admin/image",//注意你后端的上传图片服务地址

    });
    paperEvent()
});

function paperEvent() {
    $("#add_article-btn").click(function () {
        $("#add_article_modal").modal("show");
        //新增文章前查询板块
        showBlock();
    });
    $("#submit-article-btn").click(function () {
        addArticle();
    });
}

function showBlock() {
    $.ajax({
        url: URL + '/api/block/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            var blocks = result.data.blocks;
            $.each(blocks, function (index, block) {
                $("<option></option>").empty().append(block.title).attr("value", block.id).appendTo($("#blockName"));
            })
        }
    });
}

function addArticle() {
    $.ajax({
        url: URL + '/api/article/',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: {
            name: '' + name,
            sessionId: '' + sessionId,
            title: $("#title").val(),
            content: $("#editormd-html-textarea").val(),
            authorName: name,
            blockId: $("#blockName").val(),
            priority: $("#priority").val()
        },
        success: function (result) {
            var status = result.code;
            switch (status) {
                case 200:
                    $("#add_article_modal").modal('hide');
                    location.replace("/user/index");
                    break;
            }
        }
    });
}