package com.ptit.demo.config;

import com.ptit.demo.service.SystemConfigService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class MaintenanceInterceptor implements HandlerInterceptor {

    @Autowired
    private SystemConfigService configService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Bỏ qua chặn CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        
        // Không chặn các API quan trọng như đăng nhập và cấu hình
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/config")) {
            return true;
        }

        boolean maintenanceMode = configService.getBoolean("maintenanceMode", false);
        String role = request.getHeader("Role");
        
        if (maintenanceMode && !"ADMIN".equalsIgnoreCase(role)) {
            response.setStatus(503);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"Hệ thống đang bảo trì!\"}");
            return false; // Chặn request
        }
        
        return true;
    }
}
