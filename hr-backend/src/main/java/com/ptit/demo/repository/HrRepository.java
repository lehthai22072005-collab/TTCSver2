package com.ptit.demo.repository;

import com.ptit.demo.entity.Hr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HrRepository extends JpaRepository<Hr, Long> {
    Optional<Hr> findByUsername(String username);
}
