package com.example.demo.service;

import com.example.demo.model.Repository;
import com.example.demo.model.User;
import com.example.demo.repository.CommitActivityRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.PullRequestRepository;
import com.example.demo.repository.RepositoryRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RepositoryServiceImpl implements RepositoryService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private CommitActivityRepository commitActivityRepository;

    @Autowired
    private PullRequestRepository pullRequestRepository;

    @Override
    public Repository saveRepository(Repository repository) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        repository.setUser(currentUser);
        repository.setCreatedAt(LocalDateTime.now());
        return repositoryRepository.save(repository);
    }

    @Override
    public List<Repository> getAllRepositories() {
        return repositoryRepository.findAll();
    }

    @Override
    public Repository getRepositoryById(Long id) {
        return repositoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + id));
    }

    @Override
    public List<Repository> getOwnedRepositories() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return repositoryRepository.findByUser(currentUser);
    }

    @Override
    public Repository updateRepository(Long id, Repository updatedRepo) {
        Repository existing = getRepositoryById(id);
        existing.setRepoName(updatedRepo.getRepoName());
        existing.setPlatform(updatedRepo.getPlatform());
        existing.setOwner(updatedRepo.getOwner());
        existing.setRepoUrl(updatedRepo.getRepoUrl());
        return repositoryRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteRepository(Long id) {
        Repository repo = getRepositoryById(id);

        // 1. Delete linked child records first to satisfy foreign key constraints
        issueRepository.deleteByRepositoryId(id);
        commitActivityRepository.deleteByRepositoryId(id);
        pullRequestRepository.deleteByRepositoryId(id);

        // 2. Delete the repository itself
        repositoryRepository.delete(repo);
    }
}