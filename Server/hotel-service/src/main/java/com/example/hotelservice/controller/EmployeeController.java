package com.example.hotelservice.controller;

import com.example.hotelservice.dto.EmployeeRoleCountDTO;
import com.example.hotelservice.entity.Employee;
import com.example.hotelservice.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // ----- ENDPOINT-URI CRUD (5) -----

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id).orElseThrow();
        employee.setName(employeeDetails.getName());
        employee.setRole(employeeDetails.getRole());
        employee.setEmail(employeeDetails.getEmail());
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeRepository.deleteById(id);
    }

    // ----- ENDPOINT CUSTOM (1) -----

    @GetMapping("/reports/role-count")
    public List<EmployeeRoleCountDTO> getEmployeesPerRoleCount() {
        return employeeRepository.getEmployeesPerRoleCount().stream()
                .map(result -> new EmployeeRoleCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }
}