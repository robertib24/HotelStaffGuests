package com.example.hotelservice.controller;

import com.example.hotelservice.dto.DashboardStatsDTO;
import com.example.hotelservice.repository.EmployeeRepository;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;

    public DashboardController(EmployeeRepository employeeRepository,
                               GuestRepository guestRepository,
                               RoomRepository roomRepository) {
        this.employeeRepository = employeeRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        long employeeCount = employeeRepository.count();
        long guestCount = guestRepository.count();
        long roomCount = roomRepository.count();

        List<Map<String, Object>> weeklyData = Arrays.asList(
                Map.of("name", "Luni", "Oaspeți", 4),
                Map.of("name", "Marți", "Oaspeți", 3),
                Map.of("name", "Miercuri", "Oaspeți", 5),
                Map.of("name", "Joi", "Oaspeți", 7),
                Map.of("name", "Vineri", "Oaspeți", 8),
                Map.of("name", "Sâmbătă", "Oaspeți", 12),
                Map.of("name", "Duminică", "Oaspeți", 9)
        );

        return DashboardStatsDTO.builder()
                .employeeCount(employeeCount)
                .guestCount(guestCount)
                .roomCount(roomCount)
                .weeklyGuestData(weeklyData)
                .build();
    }
}