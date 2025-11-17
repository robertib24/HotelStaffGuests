package com.example.hotelservice.service;

import com.example.hotelservice.dto.auth.AuthRequestDTO;
import com.example.hotelservice.dto.auth.AuthResponseDTO;
import com.example.hotelservice.dto.auth.RegisterRequestDTO;
import com.example.hotelservice.entity.Employee;
import com.example.hotelservice.exception.DuplicateResourceException;
import com.example.hotelservice.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDTO registerRequest;
    private AuthRequestDTO authRequest;
    private Employee employee;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequestDTO();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole("ROLE_RECEPTIONIST");

        authRequest = new AuthRequestDTO();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");

        employee = new Employee();
        employee.setId(1L);
        employee.setName("Test User");
        employee.setEmail("test@example.com");
        employee.setPassword("encodedPassword");
        employee.setRole("ROLE_RECEPTIONIST");
    }

    @Test
    void registerEmployee_withUniqueEmail_shouldCreateEmployee() {
        when(employeeRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);
        when(jwtService.generateToken(any(), any())).thenReturn("mockedToken");

        AuthResponseDTO response = authService.registerEmployee(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        verify(employeeRepository).save(any(Employee.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void registerEmployee_withDuplicateEmail_shouldThrowException() {
        when(employeeRepository.findByEmail(anyString())).thenReturn(Optional.of(employee));

        assertThrows(DuplicateResourceException.class, () -> {
            authService.registerEmployee(registerRequest);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void loginEmployee_withValidCredentials_shouldReturnToken() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(employeeRepository.findByEmail(anyString())).thenReturn(Optional.of(employee));
        when(jwtService.generateToken(any(), any())).thenReturn("mockedToken");

        AuthResponseDTO response = authService.loginEmployee(authRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginEmployee_withInvalidCredentials_shouldThrowException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        assertThrows(RuntimeException.class, () -> {
            authService.loginEmployee(authRequest);
        });

        verify(jwtService, never()).generateToken(any(), any());
    }
}
