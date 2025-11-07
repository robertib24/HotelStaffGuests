package com.example.hotelservice.service;

import com.example.hotelservice.dto.EmployeeRoleCountDTO;
import com.example.hotelservice.dto.auth.EmployeeUpdateDTO;
import com.example.hotelservice.dto.auth.RegisterRequestDTO;
import com.example.hotelservice.entity.Employee;
import com.example.hotelservice.exception.DuplicateResourceException;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.EmployeeRepository;
import com.example.hotelservice.repository.GuestRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final GuestRepository guestRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, GuestRepository guestRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.guestRepository = guestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee createEmployee(RegisterRequestDTO request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent() || guestRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email-ul este deja folosit.");
        }

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole(request.getRole());

        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Angajatul cu id " + id + " nu a fost găsit."));
    }

    public Employee updateEmployee(Long id, EmployeeUpdateDTO employeeDetails) {
        Employee employee = getEmployeeById(id);

        employeeRepository.findByEmail(employeeDetails.getEmail())
                .ifPresent(existingEmployee -> {
                    if (!existingEmployee.getId().equals(id)) {
                        throw new DuplicateResourceException("Email-ul este deja folosit de alt angajat.");
                    }
                });

        guestRepository.findByEmail(employeeDetails.getEmail())
                .ifPresent(existingGuest -> {
                    throw new DuplicateResourceException("Email-ul este deja folosit de un oaspete.");
                });

        employee.setName(employeeDetails.getName());
        employee.setRole(employeeDetails.getRole());
        employee.setEmail(employeeDetails.getEmail());

        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Angajatul cu id " + id + " nu a fost găsit.");
        }
        employeeRepository.deleteById(id);
    }

    public List<EmployeeRoleCountDTO> getEmployeesPerRoleCount() {
        return employeeRepository.getEmployeesPerRoleCount().stream()
                .map(result -> new EmployeeRoleCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }
}