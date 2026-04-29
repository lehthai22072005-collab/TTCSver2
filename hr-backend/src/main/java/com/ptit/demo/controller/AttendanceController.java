package com.ptit.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    private com.ptit.demo.repository.AttendanceRepository attendanceRepository;

    @GetMapping("/all")
    public ResponseEntity<?> getAllAttendance() {
        // ÉP ĐỊNH DANH TUYỆT ĐỐI: Sử dụng trực tiếp đường dẫn package để tránh lỗi Incompatible types
        List<com.ptit.demo.entity.Attendance> list = attendanceRepository.findAll();

        // Chuyển đổi dữ liệu sang Map để gửi sang Frontend
        List<Map<String, Object>> response = list.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("employeeId", a.getEmployeeId());

            // Lấy tên nhân viên thông qua liên kết ManyToOne
            if (a.getEmployee() != null) {
                map.put("employeeName", a.getEmployee().getFullName());
            } else {
                map.put("employeeName", "Chưa xác định");
            }

            map.put("ngayCham", a.getNgayCham());
            map.put("gioVao", a.getGioVao());
            map.put("trangThai", a.getTrangThai());
            map.put("soTietDay", a.getSoTietDay());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}