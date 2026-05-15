package com.ptit.demo.controller;

import com.ptit.demo.entity.MonthlyBudget;
import com.ptit.demo.repository.MonthlyBudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // Dòng import quan trọng để fix lỗi "Cannot resolve symbol 'Optional'"

@RestController
@RequestMapping("/api/budget")
@CrossOrigin("*")
@SuppressWarnings("SpellCheckingInspection") // Tắt cảnh báo lỗi chính tả tiếng Việt
public class BudgetController {

    @Autowired
    private MonthlyBudgetRepository budgetRepository;

    // Lấy phụ cấp dự tính của một tháng
    @GetMapping("/{month}")
    public ResponseEntity<?> getBudget(@PathVariable String month) {
        String safeMonth = month.replace("-", "/");
        return ResponseEntity.ok(budgetRepository.findByThangNam(safeMonth)
                .orElse(new MonthlyBudget()));
    }

    // Lưu hoặc cập nhật phụ cấp dự tính
    @PostMapping("/save")
    public ResponseEntity<?> saveBudget(@RequestBody MonthlyBudget budget) {
        Optional<MonthlyBudget> existing = budgetRepository.findByThangNam(budget.getThangNam());
        if (existing.isPresent()) {
            MonthlyBudget update = existing.get();
            update.setPhuCapDuTinh(budget.getPhuCapDuTinh());
            return ResponseEntity.ok(budgetRepository.save(update));
        }
        return ResponseEntity.ok(budgetRepository.save(budget));
    }
}