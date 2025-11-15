package com.example.hotelservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChatRequestDTO {

    @NotBlank(message = "Mesajul este obligatoriu")
    @Size(max = 2000, message = "Mesajul trebuie să aibă maxim 2000 caractere")
    private String message;
}
