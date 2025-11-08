package com.example.hotelservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GuestProfileUpdateDTO {

    @NotBlank(message = "Numele este obligatoriu")
    private String name;

    @Size(min = 6, message = "Parola trebuie să aibă minim 6 caractere")
    private String password;
}