package com.example.demo.dto;

public class CommitDTO {

    private Long repositoryId;
    private String message;
    private String commitHash;
    private String author;
    private String status;

    public CommitDTO() {}

    public CommitDTO(Long repositoryId, String message, String commitHash, String author, String status) {
        this.repositoryId = repositoryId;
        this.message = message;
        this.commitHash = commitHash;
        this.author = author;
        this.status = status;
    }

    public Long getRepositoryId() {
        return repositoryId;
    }

    public void setRepositoryId(Long repositoryId) {
        this.repositoryId = repositoryId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}