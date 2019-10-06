var URL = 'http://localhost:8080';
var articleId = window.location.href.toString().split("#")[0].split("/article/")[1].split("?")[0];
$(function () {
    initArticle();
});

function initArticle() {
    $('body').show();
    $('img').attr('draggable', 'false');
    $('a').attr('draggable', 'false');
    $('#slider').slider();
    wallterFall();
    var username = $.cookie('username');
    if (username == null) {//用户没有登录
        $("#l-no-login").show();
        $("#l-login").hide();
    } else {//用户登录
        $("#l-welcome").empty().append(username);
        $("#l-login").show();
        $("#l-no-login").hide();
    }
    if (isInteger(articleId)) {
        $.ajax({
            url: URL + '/api/article/' + articleId,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                var article = result.data.article;
                var comments = result.data.comments;
                $("#a-title").empty().append(article.title);
                $("#a-time").empty().append(article.createTime);
                $("#a-content").prepend(article.content);
                if (comments.length != 0) {
                    $("#comment-0").remove();
                    $.each(comments, function (index, comment) {
                        createCommentView(index, comment);
                    });
                }

            }
        });
    }
}

function createCommentView(index, comment) {
    C_li = $("<li></li>").addClass("comment-content").attr('id', 'comment-' + (index + 1));
    C_span = $("<span></span>").addClass("comment-f").empty().append("#"+(index + 1));
    C_div = $("<div></div>").addClass("comment-main");
    C_p = $("<p></p>");
    C_a = $("<a></a>").removeClass('a').addClass("address").attr("href", "#").append(comment.userName);
    C_span1 = $("<span></span>").addClass("time").append("("+comment.createTime+")");
    C_br = $("<br>");
    C_p.append(C_a).append(C_span1).append(C_br).append(comment.content);
    C_div.append(C_p);
    C_li.append(C_span).append(C_div);
    $("#comment_list").prepend(C_li);
}

