package com.example.demo.controller;

import com.example.demo.dto.PullRequestDTO;
import com.example.demo.model.PullRequest;
import com.example.demo.service.PullRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pullrequests")
public class PullRequestController {

    @Autowired
    private PullRequestService pullRequestService;

    @PostMapping
    public ResponseEntity<PullRequest> createPullRequest(@RequestBody PullRequestDTO dto) {
        return ResponseEntity.ok(pullRequestService.createPullRequest(dto));
    }

    @GetMapping
    public ResponseEntity<List<PullRequest>> getAllPullRequests() {
        return ResponseEntity.ok(pullRequestService.getAllPullRequests());
    }

    @PutMapping("/{id}/merge")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PullRequest> mergePullRequest(@PathVariable Long id) {
        return ResponseEntity.ok(pullRequestService.mergePullRequest(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PullRequest> rejectPullRequest(@PathVariable Long id) {
        return ResponseEntity.ok(pullRequestService.rejectPullRequest(id));
    }
}