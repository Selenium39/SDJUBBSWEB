package com.selenium.sdjubbsweb.common.controller;

import com.selenium.sdjubbsweb.common.api.CommonApi;
import com.selenium.sdjubbsweb.common.page.CommonPage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@Slf4j
public class CommonController implements ErrorController {
    @RequestMapping(CommonApi.COMMON_REQUEST_ERROR)
    public String handleError(HttpServletRequest request) {
        //获取statusCode:401,404,500
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        return CommonPage.COMMON_PAGE_ERROR_404;

    }

    @Override
    public String getErrorPath() {
        return CommonApi.COMMON_REQUEST_ERROR;
    }
}
