package com.ptit.demo.controller;

import com.ptit.demo.entity.LeaveRequest;
import com.ptit.demo.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin("*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository repository;

    // 1. Dành cho BGH: Lấy tất cả danh sách đơn nghỉ phép của toàn trường
    @GetMapping
    public List<LeaveRequest> getAll() {
        return repository.findAll();
    }

    // 2. Dành cho Giảng viên: Lấy danh sách đơn của riêng mình
    @GetMapping("/employee/{empId}")
    public List<LeaveRequest> getByEmployeeId(@PathVariable Long empId) {
        return repository.findByEmployeeId(empId);
    }

    // 3. Dành cho Giảng viên: Nộp đơn mới
    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest request) {
        // Mặc định đơn mới gửi lên sẽ ở trạng thái "Chờ duyệt"
        if(request.getStatus() == null || request.getStatus().isEmpty()) {
            request.setStatus("Chờ duyệt");
        }
        return repository.save(request);
    }

    // 4. Dành cho BGH: Cập nhật trạng thái (Duyệt / Từ chối)
    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id).map(req -> {
            req.setStatus(status); // Set trạng thái mới (VD: "Đã duyệt" hoặc "Từ chối")
            return ResponseEntity.ok(repository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}