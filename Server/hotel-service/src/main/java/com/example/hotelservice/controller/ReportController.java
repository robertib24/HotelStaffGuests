package com.example.hotelservice.controller;

import com.example.hotelservice.repository.ReservationRepository;
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
@RequestMapping("/api/reports")
public class ReportController {

    private final ReservationRepository reservationRepository;

    public ReportController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/weekly-earnings")
    public List<Map<String, Object>> getWeeklyEarnings() {
        LocalDate startDate = LocalDate.now().minusDays(6);

        List<Object[]> queryResults = reservationRepository.getEarningsPerDay(startDate);

        Map<LocalDate, Double> earningsByDate = queryResults.stream()
                .collect(Collectors.toMap(
                        row -> (LocalDate) row[0],
                        row -> (Double) row[1]
                ));

        Map<String, Object> weeklyEarningsMap = new LinkedHashMap<>();
        Locale romanianLocale = new Locale("ro", "RO");

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, romanianLocale);
            dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);

            double earnings = earningsByDate.getOrDefault(date, 0.0).doubleValue();

            weeklyEarningsMap.put(dayName, earnings);
        }

        return weeklyEarningsMap.entrySet().stream()
                .map(entry -> Map.of(
                        "name", entry.getKey(),
                        "Încasări", entry.getValue()
                ))
                .collect(Collectors.toList());
    }
}