package com.example.hotelservice.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequestDTO {
    private Long guestId;
    private Long roomId;
    private LocalDate startDate;
    private LocalDate endDate;
}