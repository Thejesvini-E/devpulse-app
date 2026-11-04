package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.CommitActivityRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.PullRequestRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductivityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommitActivityRepository commitActivityRepository;

    @Autowired
    private PullRequestRepository pullRequestRepository;

    @Autowired
    private IssueRepository issueRepository;

    private Map<String, Object> calculateScoreForUser(User user) {
        long commits = commitActivityRepository.countByAuthor(user.getUsername());
        long mergedPrs = pullRequestRepository.countByCreatedByAndStatus(user, "MERGED");
        long resolvedIssues = issueRepository.countByAssigneeAndStatus(user, "CLOSED");

        double totalScore = (commits * 0.4) + (mergedPrs * 0.4) + (resolvedIssues * 0.2);

        Map<String, Object> scoreData = new HashMap<>();
        scoreData.put("username", user.getUsername());
        scoreData.put("fullName", user.getFullName());
        scoreData.put("commits", commits);
        scoreData.put("mergedPrs", mergedPrs);
        scoreData.put("resolvedIssues", resolvedIssues);
        scoreData.put("totalScore", totalScore);

        return scoreData;
    }

    public List<Map<String, Object>> getAllDeveloperScores() {
        return userRepository.findAll().stream()
                .filter(u -> "ROLE_DEVELOPER".equals(u.getRole()))
                .map(this::calculateScoreForUser)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getMyScore() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return calculateScoreForUser(currentUser);
    }
}