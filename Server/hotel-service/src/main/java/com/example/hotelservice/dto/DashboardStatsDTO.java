package com.example.hotelservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long employeeCount;
    private long guestCount;
    private long roomCount;
    private List<Map<String, Object>> weeklyGuestData;

    private long availableRooms;
    private long occupiedRooms;
    private long needsCleaningRooms;
    private long inMaintenanceRooms;
}