package com.example.demo.service;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.exception.RegistrationConflictException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

import java.lang.reflect.Field;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.expectThrows;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

import java.lang.reflect.Proxy;

public class AuthServiceTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
    private AuthService service;
    private UserRepository users;
    private PasswordEncoder encoder;
    private User savedUser;
    private boolean duplicateUsername;
    private boolean duplicateEmail;

    @BeforeMethod
    public void setUp() throws Exception {
        service = new AuthService();
        duplicateUsername = false;
        duplicateEmail = false;
        savedUser = null;
        users = (UserRepository) Proxy.newProxyInstance(UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class}, (proxy, method, args) -> switch (method.getName()) {
                    case "existsByUsername" -> duplicateUsername;
                    case "existsByEmail" -> duplicateEmail;
                    case "save" -> { savedUser = (User) args[0]; yield savedUser; }
                    default -> throw new UnsupportedOperationException(method.getName());
                });
        encoder = new BCryptPasswordEncoder();
        setField(service, "userRepository", users);
        setField(service, "encoder", encoder);
    }

    @Test
    public void registrationSavesBCryptEncodedPasswordAndSelectedRole() {
        RegisterRequest request = request();
        request.setRole("ROLE_MANAGER");
        service.registerUser(request);

        assertTrue(savedUser.getPassword().startsWith("$2a$"));
        assertTrue(encoder.matches("StrongPass123", savedUser.getPassword()));
        assertFalse(savedUser.getPassword().equals("StrongPass123"));
        assertEquals(savedUser.getRole(), "ROLE_MANAGER");
    }

    @Test
    public void duplicateUsernameIsRejectedWithoutSaving() {
        duplicateUsername = true;

        expectThrows(RegistrationConflictException.class, () -> service.registerUser(request()));

        assertEquals(savedUser, null);
    }

    @Test
    public void duplicateEmailIsRejectedWithoutSaving() {
        duplicateEmail = true;

        expectThrows(RegistrationConflictException.class, () -> service.registerUser(request()));

        assertEquals(savedUser, null);
    }

    @Test
    public void requestValidationRejectsInvalidEmailAndWeakPassword() {
        RegisterRequest request = request();
        request.setEmail("not-an-email");
        request.setPassword("passwordonly");

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    public void requestValidationRejectsAdminAndUnknownRoles() {
        RegisterRequest request = request();
        request.setRole("ROLE_ADMIN");
        assertFalse(validator.validate(request).isEmpty());

        request.setRole("ROLE_UNKNOWN");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    public void requestValidationAcceptsValidRegistrationFields() {
        assertTrue(validator.validate(request()).isEmpty());
    }

    private static RegisterRequest request() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("amy");
        request.setEmail("amy@example.com");
        request.setFullName("Amy Example");
        request.setPassword("StrongPass123");
        request.setRole("ROLE_DEVELOPER");
        return request;
    }

    private static void setField(Object target, String name, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(name);
        field.setAccessible(true);
        field.set(target, value);
    }
}
