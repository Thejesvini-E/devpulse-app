package com.example.demo.controller;

import com.example.demo.model.Repository;
import com.example.demo.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {

    @Autowired
    private RepositoryService repositoryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER') or hasRole('MANAGER')")
    public ResponseEntity<List<Repository>> getAllRepositories() {
        return ResponseEntity.ok(repositoryService.getAllRepositories());
    }

    @GetMapping("/owned")
    public List<Repository> getOwnedRepositories() {
        return repositoryService.getOwnedRepositories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repository> getRepositoryById(@PathVariable Long id) {
        return ResponseEntity.ok(repositoryService.getRepositoryById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER') or hasRole('MANAGER')")
    public ResponseEntity<String> createRepository(@RequestBody Repository repository) {
        repositoryService.saveRepository(repository);
        return ResponseEntity.status(HttpStatus.CREATED).body("Repository created successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRepository(@PathVariable Long id, @RequestBody Repository repository) {
        repositoryService.updateRepository(id, repository);
        return ResponseEntity.ok("Repository updated successfully."); 
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER') or hasRole('MANAGER')")
    public ResponseEntity<String> deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
        return ResponseEntity.ok("Repository deleted successfully."); 
    }
}
