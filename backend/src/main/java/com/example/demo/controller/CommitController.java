package com.example.demo.controller;

import com.example.demo.dto.CommitDTO;
import com.example.demo.model.CommitActivity;
import com.example.demo.service.CommitActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commits")
@CrossOrigin(origins = "*")
public class CommitController {

    @Autowired
    private CommitActivityService commitActivityService;

    // KEEP ONLY THIS ONE POST MAPPING (Remove the duplicate addCommit(CommitActivity) method)
    @PostMapping
    public ResponseEntity<CommitActivity> addCommit(@RequestBody CommitDTO commitDTO) {
        CommitActivity savedCommit = commitActivityService.recordCommit(commitDTO);
        return new ResponseEntity<>(savedCommit, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommitActivity>> getAllCommits() {
        return ResponseEntity.ok(commitActivityService.getAllCommits());
    }

    @GetMapping("/{repoId}")
    public ResponseEntity<List<CommitActivity>> getCommitsByRepo(@PathVariable Long repoId) {
        return ResponseEntity.ok(commitActivityService.getCommitsByRepository(repoId));
    }
}