package com.example.demo.exception;

public class RepositoryConflictException extends RuntimeException {
    public RepositoryConflictException(String message) {
        super(message);
    }
}