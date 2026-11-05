package com.example.demo.controller;

import com.example.demo.model.Issue;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        if (issue.getAssignee() == null) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            issue.setAssignee(currentUser);
        }
        return issueRepository.save(issue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id, @RequestBody Issue issueDetails) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.setTitle(issueDetails.getTitle());
        issue.setStatus(issueDetails.getStatus());
        issue.setPriority(issueDetails.getPriority());
        if (issueDetails.getAssignee() != null) {
            issue.setAssignee(issueDetails.getAssignee());
        }
        return ResponseEntity.ok(issueRepository.save(issue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIssue(@PathVariable Long id) {
        issueRepository.deleteById(id);
        return ResponseEntity.ok("Issue deleted successfully.");
    }
}
