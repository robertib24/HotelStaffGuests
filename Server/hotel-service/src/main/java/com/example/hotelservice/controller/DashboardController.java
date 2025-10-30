package com.example.hotelservice.controller;

import com.example.hotelservice.dto.DashboardStatsDTO;
import com.example.hotelservice.repository.EmployeeRepository;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public DashboardController(EmployeeRepository employeeRepository,
                               GuestRepository guestRepository,
                               RoomRepository roomRepository,
                               ReservationRepository reservationRepository) {
        this.employeeRepository = employeeRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository; // AM ADĂUGAT
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        long employeeCount = employeeRepository.count();
        long guestCount = guestRepository.count();
        long roomCount = roomRepository.count();

        List<Map<String, Object>> weeklyData = getWeeklyGuestData();

        return DashboardStatsDTO.builder()
                .employeeCount(employeeCount)
                .guestCount(guestCount)
                .roomCount(roomCount)
                .weeklyGuestData(weeklyData)
                .build();
    }

    private List<Map<String, Object>> getWeeklyGuestData() {
        LocalDate startDate = LocalDate.now().minusDays(6);

        List<Object[]> queryResults = reservationRepository.getCheckInsPerDay(startDate);

        Map<LocalDate, Long> countsByDate = queryResults.stream()
                .collect(Collectors.toMap(
                        row -> (LocalDate) row[0],
                        row -> (Long) row[1]
                ));

        Map<String, Object> weeklyGuestMap = new LinkedHashMap<>();
        Locale romanianLocale = new Locale("ro", "RO");

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, romanianLocale);
            dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);
            long count = countsByDate.getOrDefault(date, 0L);
            weeklyGuestMap.put(dayName, count);
        }

        return weeklyGuestMap.entrySet().stream()
                .map(entry -> Map.of(
                        "name", entry.getKey(),
                        "Oaspeți", entry.getValue()
                ))
                .collect(Collectors.toList());
    }
}