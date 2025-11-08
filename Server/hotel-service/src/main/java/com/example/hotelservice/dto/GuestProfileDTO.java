package com.example.hotelservice.dto;

import com.example.hotelservice.entity.Guest;
import lombok.Data;

@Data
public class GuestProfileDTO {
    private Long id;
    private String name;
    private String email;

    public GuestProfileDTO(Guest guest) {
        this.id = guest.getId();
        this.name = guest.getName();
        this.email = guest.getEmail();
    }
}