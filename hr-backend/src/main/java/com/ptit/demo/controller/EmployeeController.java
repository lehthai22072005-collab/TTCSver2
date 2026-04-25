package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<Employee>> getAll() {
        List<Employee> list = employeeRepository.findAll();
        return ResponseEntity.ok(list); // Trả về kèm status 200 OK
    }
    
    // API lấy chi tiết 1 nhân viên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}