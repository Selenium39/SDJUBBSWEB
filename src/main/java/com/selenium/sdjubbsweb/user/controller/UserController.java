package com.selenium.sdjubbsweb.user.controller;

import com.selenium.sdjubbsweb.user.api.UserApi;
import com.selenium.sdjubbsweb.user.pages.UserPage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * description:前台页面跳转
 */
@Controller
@RequestMapping("/user")
@Slf4j
public class UserController {
    /**
     * method: get
     * url: /
     * description: 首页
     */
    @GetMapping(UserApi.USER)
    public String index() {
        return UserPage.USER_PAGE_INDEX;
    }

    /**
     * method: get
     * url: /index
     * description: 首页
     */
    @GetMapping(UserApi.USER_INDEX)
    public String index1() {
        return UserPage.USER_PAGE_INDEX;
    }


    /**
     * method: get
     * url: /template
     * description: 模板
     */
    @GetMapping(UserApi.USER_TEMPLATE)
    public String template() {
        return UserPage.USER_PAGE_TEMPLATE;
    }

    /**
     * method: get
     * url: /login
     * description: 登录
     */
    @GetMapping(UserApi.USER_LOGIN)
    public String login() {
        return UserPage.USER_PAGE_LOGIN;
    }

    /**
     * method: get
     * url: /register
     * description: 注册
     */
    @GetMapping(UserApi.USER_REGISTER)
    public String register() {
        return UserPage.USER_PAGE_REGISTER;
    }

    /**
     * method: get
     * url: /block
     * description: 板块目录
     */
    @GetMapping(UserApi.USER_BLOCKS)
    public String showBlocks() {
        return UserPage.USER_PAGE_BLOCKS;
    }

    /**
     * method: get
     * url: /block
     * description: 板块
     */
    @GetMapping(UserApi.USER_BLOCK)
    public String showBlock(@PathVariable("id") Integer id) {
        return UserPage.USER_PAGE_BLOCK;
    }

    /**
     * method: get
     * url: /block/search
     * description: 查找文章
     */
    @GetMapping(UserApi.USER_SEARCH)
    public String searchArticle() {
        return UserPage.USER_PAGE_ARTICLE_SEARCH;
    }

    /**
     * method: get
     * url: /article
     * description: 查看文章
     */
    @GetMapping(UserApi.USER_ARTICLE)
    public String showArticle(@PathVariable("id") Integer id) {
        return UserPage.USER_PAGE_ARTICLE;
    }

    /**
     * method: get
     * url: /md
     * description: 添加文章
     */
    @GetMapping(UserApi.USER_MD)
    public String addArticle() {
        log.info("addArticle");
        return UserPage.USER_PAGE_MARKDOWN;
    }

    @GetMapping(UserApi.USER_PROFILE)
    public String showProfile() {
        return UserPage.USER_PAGE_PROFILE;
    }

    @GetMapping(UserApi.USER_FEATURE_MESSAGE)
    public String showFeatureMessage() {
        return UserPage.USER_PAGE_MESSAGE;
    }

    @GetMapping(UserApi.USER_FEATURE_QR)
    public String showFeatureQr() {
        return UserPage.USER_PAGE_QR;
    }

    @GetMapping(UserApi.USER_FEATURE_CHAT)
    public String showChatRoom(){
        return UserPage.USER_PAGE_CHAT;
    }

}
