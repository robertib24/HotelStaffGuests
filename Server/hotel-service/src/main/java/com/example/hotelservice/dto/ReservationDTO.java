package com.example.hotelservice.dto;

import com.example.hotelservice.entity.Reservation;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationDTO {
    private Long id;
    private String guestName;
    private String roomNumber;
    private String roomType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;

    public ReservationDTO(Reservation reservation) {
        this.id = reservation.getId();
        this.guestName = reservation.getGuest().getName();
        this.roomNumber = reservation.getRoom().getNumber();
        this.roomType = reservation.getRoom().getType();
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.totalPrice = reservation.getTotalPrice();
    }
}