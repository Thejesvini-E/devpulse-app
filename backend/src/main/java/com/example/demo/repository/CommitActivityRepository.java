package com.example.demo.repository;

import com.example.demo.model.CommitActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommitActivityRepository extends JpaRepository<CommitActivity, Long> {
    List<CommitActivity> findByRepositoryId(Long repositoryId);
    long countByRepositoryId(Long repositoryId);
    long countByAuthor(String author);
    void deleteByRepositoryId(Long repositoryId);
}