package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "analytics_reports")
public class AnalyticsReport {
    @Id
    private Long id;
    private String reportType;
    private LocalDateTime generatedAt;
    private String summary;
    
    public AnalyticsReport() {
    }

    public AnalyticsReport(Long id, String reportType, LocalDateTime generatedAt, String summary) {
        this.id = id;
        this.reportType = reportType;
        this.generatedAt = generatedAt;
        this.summary = summary;
    }

    public Long getId() {
        return id;
    }

    public String getReportType() {
        return reportType;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public String getSummary() {
        return summary;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    
}
