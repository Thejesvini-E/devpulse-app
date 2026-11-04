package com.example.demo.repository;

import com.example.demo.model.AnalyticsReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalyticsReportRepository extends JpaRepository<AnalyticsReport, Long> {
    List<AnalyticsReport> findByReportType(String reportType);
}