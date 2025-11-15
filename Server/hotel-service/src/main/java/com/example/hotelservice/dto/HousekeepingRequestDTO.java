package com.example.hotelservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HousekeepingRequestDTO {

    @NotNull(message = "ID-ul camerei este obligatoriu")
    private Long roomId;

    @NotBlank(message = "Tipul cererii este obligatoriu")
    private String requestType;

    @Size(max = 500, message = "Descrierea trebuie să aibă maxim 500 caractere")
    private String description;

    private String priority;
}
