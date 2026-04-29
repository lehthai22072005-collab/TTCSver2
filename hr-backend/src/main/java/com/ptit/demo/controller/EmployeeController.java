package com.ptit.demo.controller;

import com.ptit.demo.entity.Accountant;
import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Teacher;
import com.ptit.demo.repository.AccountantRepository;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*") // Cho phép Frontend (port 3000) gọi API
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AccountantRepository accountantRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // 1. Lấy danh sách toàn bộ nhân viên (READ)
    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    // 2. Thêm nhân viên mới & Tự động cấp tài khoản theo chức vụ (CREATE)
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        // Lưu thông tin hồ sơ vào bảng employee
        Employee savedEmp = employeeRepository.save(employee);

        // Logic tự động tạo tài khoản dựa trên Position (Chức vụ)
        String position = savedEmp.getPosition();

        if ("Kế toán".equalsIgnoreCase(position)) {
            Accountant acc = new Accountant();
            acc.setUsername(savedEmp.getEmail()); // Username là Email
            acc.setPassword("123456");           // Mật khẩu mặc định
            acc.setEmployee(savedEmp);            // Link tới hồ sơ
            accountantRepository.save(acc);
        }
        else if ("Giảng viên".equalsIgnoreCase(position)) {
            Teacher teacher = new Teacher();
            teacher.setUsername(savedEmp.getEmail());
            teacher.setPassword("123456");
            teacher.setEmployee(savedEmp);
            teacherRepository.save(teacher);
        }

        return savedEmp;
    }

    // 3. Cập nhật hồ sơ nhân sự (UPDATE) - Đã fix đầy đủ 7 trường dữ liệu
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee details) {
        return employeeRepository.findById(id).map(emp -> {
            // Cập nhật các trường cơ bản
            emp.setFullName(details.getFullName());
            emp.setEmail(details.getEmail());
            emp.setPosition(details.getPosition());
            emp.setDepartment(details.getDepartment());

            // Cập nhật các trường mở rộng (Quan trọng)
            emp.setAcademicDegree(details.getAcademicDegree());   // Bằng cấp
            emp.setContractEndDate(details.getContractEndDate()); // Ngày hết hạn HĐ
            emp.setPhone(details.getPhone());                     // Số điện thoại

            // Lưu lại vào Database
            return ResponseEntity.ok(employeeRepository.save(emp));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Đã xóa bỏ function DELETE theo yêu cầu của bạn.
}