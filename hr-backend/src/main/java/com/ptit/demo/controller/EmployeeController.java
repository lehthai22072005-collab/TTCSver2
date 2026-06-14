package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*") // Cho phép Frontend (port 3000) gọi API
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // 1. Lấy danh sách toàn bộ nhân viên (READ)
    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    // 2. Thêm nhân viên mới (HR chỉ thêm hồ sơ)
    @PostMapping
    @Transactional
    public Employee createEmployee(@RequestBody Employee employee) {
        // Chức vụ trên form chỉ là gợi ý để Admin cấp tài khoản, không quyết định quyền đăng nhập.
        employee.setPosition(null);
        employee.setLoaiGiangVien(null);
        employee.setHocHam(null);
        return employeeRepository.save(employee);
    }

    // 3. Cập nhật đầy đủ hồ sơ nhân sự, trừ chức vụ hiển thị.
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee details) {
        return employeeRepository.findById(id).map(emp -> {
            emp.setFullName(details.getFullName());
            emp.setEmail(details.getEmail());
            emp.setDepartment(details.getDepartment());
            emp.setAcademicDegree(details.getAcademicDegree());
            emp.setContractStartDate(details.getContractStartDate());
            emp.setContractEndDate(details.getContractEndDate());
            emp.setPhone(details.getPhone());
            emp.setBaseSalary(details.getBaseSalary());
            emp.setNhomNhanSu(details.getNhomNhanSu());
            emp.setNgachCongChuc(details.getNgachCongChuc());
            emp.setBacLuong(details.getBacLuong());

            return ResponseEntity.ok(employeeRepository.save(emp));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Đã xóa bỏ function DELETE theo yêu cầu của bạn.
}
