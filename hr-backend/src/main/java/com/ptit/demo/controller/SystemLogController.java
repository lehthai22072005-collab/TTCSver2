package com.ptit.demo.controller;

import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/system-logs")
@CrossOrigin("*")
public class SystemLogController {

    @Autowired
    private SystemLogRepository logRepository;

    @GetMapping
    public List<SystemLog> getLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }

    @PostMapping
    public SystemLog createLog(@RequestBody SystemLog log) {
        log.setTimestamp(LocalDateTime.now());
        return logRepository.save(log);
    }
}
