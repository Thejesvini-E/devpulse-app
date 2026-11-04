package com.example.demo.service;

import com.example.demo.model.Repository;
import java.util.List;

public interface RepositoryService {
    Repository saveRepository(Repository repository);
    List<Repository> getAllRepositories();
    Repository getRepositoryById(Long id);
    List<Repository> getOwnedRepositories();
    Repository updateRepository(Long id, Repository repository);
    void deleteRepository(Long id);
}