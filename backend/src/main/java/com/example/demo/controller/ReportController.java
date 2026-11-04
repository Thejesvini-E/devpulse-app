package com.example.demo.controller;

import com.example.demo.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/team")
    public ResponseEntity<List<Map<String, Object>>> getTeamReports() {
        return ResponseEntity.ok(reportService.getTeamReports());
    }

    @GetMapping("/repository")
    public ResponseEntity<List<Map<String, Object>>> getRepositoryReports() {
        return ResponseEntity.ok(reportService.getRepositoryReports());
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getActivityReports() {
        return ResponseEntity.ok(reportService.getActivityReports());
    }
}   