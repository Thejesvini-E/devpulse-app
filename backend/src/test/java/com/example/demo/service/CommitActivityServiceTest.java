package com.example.demo.service;

import com.example.demo.dto.CommitDTO;
import com.example.demo.model.CommitActivity;
import com.example.demo.model.Repository;
import com.example.demo.repository.CommitActivityRepository;
import com.example.demo.repository.RepositoryRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Optional;

import static org.testng.Assert.assertEquals;

public class CommitActivityServiceTest {
    private CommitActivityService service;
    private CommitActivityRepository commitRepository;
    private RepositoryRepository repositoryRepository;
    private Repository repository;

    @BeforeMethod
    public void setUp() throws Exception {
        service = new CommitActivityService();
        repository = new Repository();
        repositoryRepository = (RepositoryRepository) Proxy.newProxyInstance(
                RepositoryRepository.class.getClassLoader(),
                new Class<?>[]{RepositoryRepository.class},
                (proxy, method, args) -> "findById".equals(method.getName())
                        ? Optional.of(repository)
                        : throwUnsupported(method.getName()));
        commitRepository = (CommitActivityRepository) Proxy.newProxyInstance(
                CommitActivityRepository.class.getClassLoader(),
                new Class<?>[]{CommitActivityRepository.class},
                (proxy, method, args) -> "save".equals(method.getName())
                        ? args[0]
                        : throwUnsupported(method.getName()));

        setField(service, "commitActivityRepository", commitRepository);
        setField(service, "repositoryRepository", repositoryRepository);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("amy", "test", List.of()));
    }

    @AfterMethod
    public void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void commitAuthorUsesAuthenticatedUsernameForProductivityAttribution() {
        CommitDTO dto = new CommitDTO(1L, "Add dashboard", "abc1234", "forged-author", "VERIFIED");

        CommitActivity saved = service.recordCommit(dto);

        assertEquals(saved.getAuthor(), "amy");
    }

    private static void setField(Object target, String name, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(name);
        field.setAccessible(true);
        field.set(target, value);
    }

    private static Object throwUnsupported(String method) {
        throw new UnsupportedOperationException(method);
    }
}
