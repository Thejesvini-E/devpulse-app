package com.example.demo.controller;

import com.example.demo.service.ProductivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productivity")
public class ProductivityController {

    @Autowired
    private ProductivityService productivityService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getAllScores() {
        return ResponseEntity.ok(productivityService.getAllDeveloperScores());
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyScore() {
        return ResponseEntity.ok(productivityService.getMyScore());
    }
}