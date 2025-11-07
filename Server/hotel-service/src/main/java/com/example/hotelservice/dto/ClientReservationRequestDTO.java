package com.example.hotelservice.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientReservationRequestDTO {

    @NotNull(message = "ID-ul camerei este obligatoriu")
    private Long roomId;

    @NotNull(message = "Data de început este obligatorie")
    @FutureOrPresent(message = "Data de început trebuie să fie în viitor sau prezent")
    private LocalDate startDate;

    @NotNull(message = "Data de sfârșit este obligatorie")
    @FutureOrPresent(message = "Data de sfârșit trebuie să fie în viitor")
    private LocalDate endDate;
}