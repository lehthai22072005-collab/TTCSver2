package com.ptit.demo.service;

import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemLogService {

    @Autowired
    private SystemLogRepository systemLogRepository;

    public void log(String action, String username) {
        try {
            SystemLog log = new SystemLog();
            log.setUserRole(username == null || username.isBlank() ? "System" : username);
            log.setNoiDung(action);
            systemLogRepository.save(log);
        } catch (Exception e) {
            System.out.println("Không thể ghi system log: " + e.getMessage());
        }
    }
}
