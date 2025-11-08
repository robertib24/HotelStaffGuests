package com.example.hotelservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequestDTO {

    @NotNull(message = "ID-ul camerei este obligatoriu")
    private Long roomId;

    @NotNull(message = "Rating-ul este obligatoriu")
    @Min(value = 1, message = "Rating-ul trebuie să fie minim 1")
    @Max(value = 5, message = "Rating-ul trebuie să fie maxim 5")
    private Integer rating;

    @NotBlank(message = "Comentariul este obligatoriu")
    @Size(min = 10, max = 1000, message = "Comentariul trebuie să aibă între 10 și 1000 caractere")
    private String comment;
}