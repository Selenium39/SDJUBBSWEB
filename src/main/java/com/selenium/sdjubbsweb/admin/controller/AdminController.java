package com.selenium.sdjubbsweb.admin.controller;

import com.selenium.sdjubbsweb.admin.api.AdminApi;
import com.selenium.sdjubbsweb.admin.pages.AdminPage;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * description:后台页面跳转
 */
@Controller
@RequestMapping("/admin")
public class AdminController {
    /**
     * method: get
     * url: /
     * description: 首页
     */
    @GetMapping(AdminApi.ADMIN_REQUEST_INDEX)
    public String index() {
        return AdminPage.ADMIN_PAGE_INDEX;
    }
}
