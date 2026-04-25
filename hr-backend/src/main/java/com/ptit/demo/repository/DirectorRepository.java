package com.ptit.demo.repository;

import com.ptit.demo.entity.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director, Integer> {
    Optional<Director> findByUsername(String username);
}
