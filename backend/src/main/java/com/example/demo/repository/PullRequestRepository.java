package com.example.demo.repository;

import com.example.demo.model.PullRequest;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PullRequestRepository extends JpaRepository<PullRequest, Long> {
    List<PullRequest> findByRepositoryId(Long repositoryId);
    long countByRepositoryIdAndStatus(Long repositoryId, String status);
    long countByStatus(String status);
    List<PullRequest> findByCreatedBy(User user);
    void deleteByRepositoryId(Long repositoryId);
    long countByCreatedByAndStatus(User createdBy, String status);
}