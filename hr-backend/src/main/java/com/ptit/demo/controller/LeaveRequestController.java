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

    @GetMapping
    public List<LeaveRequest> getAll() {
        return repository.findAll();
    }

    @GetMapping("/employee/{empId}")
    public List<LeaveRequest> getByEmployeeId(@PathVariable Long empId) {
        return repository.findByEmployeeId(empId);
    }

    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest request) {
        if(request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        return repository.save(request);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repository.findById(id).map(req -> {
            req.setStatus(status);
            return ResponseEntity.ok(repository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}
