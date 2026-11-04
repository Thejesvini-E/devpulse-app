package com.example.demo.service;

import com.example.demo.dto.CommitDTO;
import com.example.demo.model.CommitActivity;
import com.example.demo.model.Repository;
import com.example.demo.repository.CommitActivityRepository;
import com.example.demo.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommitActivityService {

    @Autowired
    private CommitActivityRepository commitActivityRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    public CommitActivity recordCommit(CommitDTO dto) {
        if (dto == null || dto.getRepositoryId() == null) {
            throw new IllegalArgumentException("Repository ID must not be null");
        }

        Repository repo = repositoryRepository.findById(dto.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + dto.getRepositoryId()));

        CommitActivity entity = new CommitActivity();
        entity.setMessage(dto.getMessage() != null ? String.valueOf(dto.getMessage()) : "");

        // Explicit string resolution avoids ternary object inference issues
        if (dto.getCommitHash() != null && !String.valueOf(dto.getCommitHash()).trim().isEmpty()) {
            entity.setCommitHash(String.valueOf(dto.getCommitHash()));
        } else {
            entity.setCommitHash(UUID.randomUUID().toString().substring(0, 7));
        }

        if (dto.getAuthor() != null && !String.valueOf(dto.getAuthor()).trim().isEmpty()) {
            entity.setAuthor(String.valueOf(dto.getAuthor()));
        } else {
            entity.setAuthor("developer");
        }

        if (dto.getStatus() != null && !String.valueOf(dto.getStatus()).trim().isEmpty()) {
    entity.setStatus(String.valueOf(dto.getStatus()));
} else {
    entity.setStatus("VERIFIED");
}

        entity.setRepository(repo);
        entity.setCommitDate(LocalDateTime.now());

        return commitActivityRepository.save(entity);
    }

    public List<CommitActivity> getAllCommits() {
        return commitActivityRepository.findAll();
    }

    public List<CommitActivity> getCommitsByRepository(Long repositoryId) {
        return commitActivityRepository.findByRepositoryId(repositoryId);
    }
}