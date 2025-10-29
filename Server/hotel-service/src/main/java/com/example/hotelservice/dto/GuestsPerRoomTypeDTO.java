package com.example.hotelservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestsPerRoomTypeDTO {
    private String roomType;
    private String guestName;
    private String guestEmail;
}