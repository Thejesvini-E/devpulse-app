package com.example.demo.service;

import com.example.demo.dto.PullRequestDTO;
import com.example.demo.model.PullRequest;
import com.example.demo.model.Repository;
import com.example.demo.model.User;
import com.example.demo.repository.PullRequestRepository;
import com.example.demo.repository.RepositoryRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PullRequestService {

    @Autowired
    private PullRequestRepository pullRequestRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public PullRequest createPullRequest(PullRequestDTO dto) {
        Repository repository = repositoryRepository.findById(dto.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        User currentUser = getCurrentAuthenticatedUser();

        PullRequest pr = new PullRequest();
        pr.setTitle(dto.getTitle());
        pr.setDescription(dto.getDescription());
        pr.setRepository(repository);
        pr.setCreatedBy(currentUser);
        pr.setStatus("OPEN");

        return pullRequestRepository.save(pr);
    }

    public List<PullRequest> getAllPullRequests() {
        User currentUser = getCurrentAuthenticatedUser();
        if ("ROLE_DEVELOPER".equals(currentUser.getRole())) {
            return pullRequestRepository.findByCreatedBy(currentUser);
        }
        return pullRequestRepository.findAll();
    }

    public PullRequest mergePullRequest(Long id) {
        PullRequest pr = pullRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pull request not found"));
        pr.setStatus("MERGED");
        pr.setMergedAt(LocalDateTime.now());
        return pullRequestRepository.save(pr);
    }

    public PullRequest rejectPullRequest(Long id) {
        PullRequest pr = pullRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pull request not found"));
        pr.setStatus("REJECTED");
        return pullRequestRepository.save(pr);
    }
}