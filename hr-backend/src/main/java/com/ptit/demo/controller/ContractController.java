package com.ptit.demo.controller;

import com.ptit.demo.entity.Contract;
import com.ptit.demo.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin("*")
public class ContractController {

    @Autowired
    private ContractRepository contractRepository;

    @GetMapping
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    @PostMapping
    public Contract createContract(@RequestBody Contract contract) {
        return contractRepository.save(contract);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contract> updateContract(@PathVariable Long id, @RequestBody Contract contractDetails) {
        return contractRepository.findById(id)
                .map(contract -> {
                    contract.setContractNo(contractDetails.getContractNo());
                    contract.setEmployeeId(contractDetails.getEmployeeId());
                    contract.setEmployeeName(contractDetails.getEmployeeName());
                    contract.setType(contractDetails.getType());
                    contract.setRole(contractDetails.getRole());
                    contract.setStartDate(contractDetails.getStartDate());
                    contract.setEndDate(contractDetails.getEndDate());
                    contract.setStatus(contractDetails.getStatus());
                    Contract updated = contractRepository.save(contract);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable Long id) {
        return contractRepository.findById(id)
                .map(contract -> {
                    contractRepository.delete(contract);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-contract/{employeeId}")
    public ResponseEntity<Contract> getMyContract(@PathVariable Long employeeId) {
        List<Contract> contracts = contractRepository.findByEmployeeId(employeeId);
        if (!contracts.isEmpty()) {
            return ResponseEntity.ok(contracts.get(0)); // Get the first (or active) contract
        }
        return ResponseEntity.notFound().build();
    }
}
