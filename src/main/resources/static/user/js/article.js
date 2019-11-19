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
                        var replyIsShowing = false;
                        createCommentView(index, comment);
                        $("#comment-" + index).mouseenter(function () {
                            $("#comment-report-" + (index - 1)).attr("style", "visibility:visible");
                            $("#comment-reply-" + (index - 1)).attr("style", "visibility:visible");
                        });
                        $("#comment-" + index).mouseleave(function () {
                            $("#comment-report-" + (index - 1)).attr("style", "visibility:hidden");
                            $("#comment-reply-" + (index - 1)).attr("style", "visibility:hidden");
                        });
                        $.ajax({
                            url: URL + '/api/comment/' + comment.id,
                            type: 'GET',
                            xhrFields: {
                                withCredentials: true
                            },
                            success(result) {
                                var replys = result.data.replys;
                                if (replys.length != 0) {
                                    $("#comment-show-reply-" + index).attr("style", "visibility:visible").append("(" + replys.length + ")");
                                    createResponseView(index);
                                    var comment_index = index;
                                    $("#comment-show-reply-" + index).click(function () {
                                        if (replyIsShowing) {
                                           $(".reply"+comment_index).remove();
                                            replyIsShowing = false;
                                            $("#comment-show-reply-" + index).empty().append("查看回复("+replys.length+")");
                                        } else {
                                            $("#comment-show-reply-" + index).empty().append("收起回复");
                                            $.each(replys, function (index, reply) {
                                                createReplyView(comment_index, index, reply);
                                            })
                                            replyIsShowing = true;
                                        }
                                    });
                                }
                            }
                        });
                    });
                }

            },

        });
        $("#comment-submit").click(function () {
            var send = true;
            if (username == null) {
                alert("您尚未登录,请登录后再进行评论");
                send = false;
                window.location.reload();
                return false;
            }
            if ($("#comment-textarea").val().trim() == null || $("#comment-textarea").val().trim().length == 0 || $("#comment-textarea").val().trim() == "") {
                alert("评论内容不能为空");
                send = false;
                window.location.reload();
                return false;
            }
            if (send) {
                $.ajax({
                    url: URL + '/api/comment',
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        username: username,
                        sessionId: $.cookie(username),
                        content: $("#comment-textarea").val(),
                        articleId: articleId,
                        userName: username,
                    },
                    success: function (result) {
                        var status = result.code;
                        switch (status) {
                            case 200:
                                alert("评论成功");
                                window.location.reload();
                                break;
                            case 201:
                                var errorCode = result.errorCode;
                                var reason = result.reason;
                                switch (errorCode) {
                                    case 4000:
                                        alert("评论内容不能为空");
                                        break;
                                }
                                window.location.reload();
                                break;
                        }
                    }
                });
            }
            return false;
        });
    } else {
        //todo
    }
}

function createCommentView(index, comment) {
    C_li = $("<li></li>").addClass("comment-content").attr('id', 'comment-' + (index + 1));
    C_span = $("<span></span>").addClass("comment-f").empty().append("#" + (index + 1));
    C_div = $("<div></div>").addClass("comment-main");
    C_p = $("<p></p>");
    C_a = $("<a></a>").removeClass('a').addClass("comment-name").attr("href", "#").append(comment.userName);
    C_span1 = $("<span></span>").addClass("time").append("(" + comment.createTime + ")");
    C_span2 = $("<span></span>").addClass("comment-response");
    C_a1 = $("<a></a>").append("举报").attr("style", "visibility:hidden").attr("id", "comment-report-" + index);
    C_a2 = $("<a></a>").append("回复").attr("style", "visibility:hidden").attr("id", "comment-reply-" + index);
    C_a3 = $("<a></a>").append("查看回复").attr("style", "visibility:hidden").attr("id", "comment-show-reply-" + index);
    C_span2.append(C_a1).append(C_a2).append(C_a3);
    C_br = $("<br>");
    C_p.append(C_a).append(C_span1).append(C_span2).append(C_br).append(comment.content);
    C_div.append(C_p);
    C_li.append(C_span).append(C_div);
    $("#comment_list").prepend(C_li);
}

function createResponseView(index) {
    C_div = $("<div></div>").addClass("reply-main");
    C_p = $("<p></p>");
    C_a = $("<a></a>").removeClass('a').addClass("comment-name").attr("href", "#").append(comment.userName);
    C_span1 = $("<span></span>").addClass("time").append("(" + comment.createTime + ")");
    C_span2 = $("<span></span>").addClass("comment-response");
    C_a1 = $("<a></a>").append("举报").attr("style", "visibility:hidden").attr("id", "comment-report-" + (index + 1));
    C_a2 = $("<a></a>").append("回复").attr("style", "visibility:hidden").attr("id", "comment-reply-" + (index + 1));
    C_a3 = $("<a></a>").append("查看回复").attr("style", "visibility:hidden").attr("id", "comment-show-reply-" + (index + 1));
    C_span2.append(C_a1).append(C_a2).append(C_a3);
    C_br = $("<br>");
    C_p.append(C_a).append("  ").append(C_span1).append(C_span2).append(C_br).append(comment.content);
    C_div.append(C_p);
}

function createReplyView(comment_index, index, reply) {
    C_div = $("<div></div>").addClass("reply-main").addClass("reply"+comment_index);
    C_p = $("<p></p>");
    C_a = $("<a></a>").removeClass('a').addClass("reply-name").attr("href", "#").append(reply.sendUserName);
    C_a_1 = $("<a></a>").removeClass('a').addClass("reply-name").attr("href", "#").append(reply.receiverUserName);
    C_span1 = $("<span></span>").addClass("time").append("(" + reply.createTime + ")");
    C_span2 = $("<span></span>").addClass("comment-response");
    C_br = $("<br>");
    C_p.append(C_a).append("  回复  ").append(C_a_1).append("  ").append(C_span1).append(C_span2).append(C_br).append(reply.content);
    C_div.append(C_p);
    $("#comment-" + (comment_index + 1)).append(C_div);
}





