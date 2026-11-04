package com.example.demo.repository;

import com.example.demo.model.Repository;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepositoryRepository extends JpaRepository<Repository, Long> {
    List<Repository> findByUser(User user);

    @Query("SELECT r FROM Repository r WHERE r.repoName LIKE %:name%")
    List<Repository> searchRepositoriesByName(@Param("name") String name);
}