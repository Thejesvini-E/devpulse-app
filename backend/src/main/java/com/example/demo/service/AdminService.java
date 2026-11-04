package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.PullRequestRepository;
import com.example.demo.repository.RepositoryRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private PullRequestRepository prRepository;

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRepositories", repositoryRepository.count());
        stats.put("pendingPRs", prRepository.countByStatus("OPEN"));
        stats.put("systemStatus", "Stable");
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}