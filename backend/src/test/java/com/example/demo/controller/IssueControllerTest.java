package com.example.demo.controller;

import com.example.demo.model.Issue;
import com.example.demo.model.User;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.UserRepository;
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

public class IssueControllerTest {
    private IssueController controller;
    private IssueRepository issueRepository;
    private User developer;

    @BeforeMethod
    public void setUp() throws Exception {
        controller = new IssueController();
        developer = new User("amy", "amy@example.com", "encoded", "ROLE_DEVELOPER", "Amy Example");
        UserRepository userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> "findByUsername".equals(method.getName())
                        ? Optional.of(developer)
                        : throwUnsupported(method.getName()));
        issueRepository = (IssueRepository) Proxy.newProxyInstance(
                IssueRepository.class.getClassLoader(),
                new Class<?>[]{IssueRepository.class},
                (proxy, method, args) -> "save".equals(method.getName())
                        ? args[0]
                        : throwUnsupported(method.getName()));

        setField(controller, "issueRepository", issueRepository);
        setField(controller, "userRepository", userRepository);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("amy", "test", List.of()));
    }

    @AfterMethod
    public void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void newUnassignedIssueIsAssignedToCurrentUserForProductivityAttribution() {
        Issue issue = new Issue();
        issue.setTitle("Fix failing test");
        issue.setPriority("MEDIUM");

        Issue saved = controller.createIssue(issue);

        assertEquals(saved.getAssignee(), developer);
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
