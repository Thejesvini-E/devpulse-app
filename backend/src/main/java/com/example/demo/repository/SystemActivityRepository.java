package com.example.demo.repository;

import com.example.demo.model.SystemActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemActivityRepository extends JpaRepository<SystemActivity, Long> {
    List<SystemActivity> findByOrderByTimestampDesc();
}