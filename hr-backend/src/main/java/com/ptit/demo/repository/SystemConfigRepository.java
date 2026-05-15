package com.ptit.demo.repository;

import com.ptit.demo.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Integer> {
    SystemConfig findByConfigKey(String key);
}