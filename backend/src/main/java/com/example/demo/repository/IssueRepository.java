package com.example.demo.repository;

import com.example.demo.model.Issue;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByRepositoryId(Long repositoryId);
    long countByRepositoryIdAndStatus(Long repositoryId, String status);
    long countByStatus(String status);
    void deleteByRepositoryId(Long repositoryId);
    long countByAssigneeAndStatus(User assignee, String status);
}