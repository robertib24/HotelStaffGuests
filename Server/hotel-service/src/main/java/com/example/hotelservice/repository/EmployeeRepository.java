package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e.role, COUNT(e) FROM Employee e GROUP BY e.role")
    List<Object[]> getEmployeesPerRoleCount();

    Optional<Employee> findByEmail(String email);
}