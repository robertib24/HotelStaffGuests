package com.example.hotelservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomServiceRequestDTO {

    @NotBlank(message = "Cererea este obligatorie")
    @Size(max = 1000, message = "Cererea trebuie să aibă maxim 1000 caractere")
    private String request;

    private Long roomId;

    private String notes;
}
