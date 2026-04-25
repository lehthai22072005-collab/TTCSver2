package com.ptit.demo.repository;

import com.ptit.demo.entity.Accountant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountantRepository extends JpaRepository<Accountant, Long> {
    Optional<Accountant> findByUsername(String username);
}
