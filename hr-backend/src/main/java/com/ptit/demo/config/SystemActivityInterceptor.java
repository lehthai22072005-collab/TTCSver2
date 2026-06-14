package com.ptit.demo.config;

import com.ptit.demo.service.SystemLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class SystemActivityInterceptor implements HandlerInterceptor {

    private static final Map<String, String> ACTIONS = Map.ofEntries(
            Map.entry("/api/employees", "Quản lý hồ sơ nhân sự"),
            Map.entry("/api/attendance", "Quản lý dữ liệu chấm công"),
            Map.entry("/api/salary", "Thực hiện nghiệp vụ tính lương"),
            Map.entry("/api/leave", "Thực hiện nghiệp vụ nghỉ phép"),
            Map.entry("/api/declarations", "Thực hiện nghiệp vụ kê khai giờ dạy"),
            Map.entry("/api/kpi", "Thực hiện nghiệp vụ đánh giá KPI"),
            Map.entry("/api/rewards", "Thực hiện nghiệp vụ khen thưởng/kỷ luật"),
            Map.entry("/api/contracts", "Quản lý hợp đồng"),
            Map.entry("/api/budget", "Quản lý ngân sách"),
            Map.entry("/api/profile", "Cập nhật thông tin cá nhân"),
            Map.entry("/api/departments", "Quản lý phòng ban")
    );

    @Autowired
    private SystemLogService systemLogService;

    @Override
    public void afterCompletion(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception ex
    ) {
        if (!isMutation(request.getMethod()) || response.getStatus() >= 400 || ex != null) {
            return;
        }

        String uri = request.getRequestURI();
        String action = ACTIONS.entrySet().stream()
                .filter(entry -> uri.startsWith(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);

        if (action == null) {
            return;
        }

        String username = request.getHeader("Username");
        systemLogService.log(action + ": " + request.getMethod() + " " + uri, username);
    }

    private boolean isMutation(String method) {
        return "POST".equalsIgnoreCase(method)
                || "PUT".equalsIgnoreCase(method)
                || "PATCH".equalsIgnoreCase(method)
                || "DELETE".equalsIgnoreCase(method);
    }
}
