package com.example.hotelservice.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeUpdateDTO {

    @NotBlank(message = "Numele este obligatoriu")
    private String name;

    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Email-ul trebuie să fie valid")
    private String email;

    @Size(min = 4, message = "Parola trebuie să aibă minim 4 caractere")
    private String password;

    @NotBlank(message = "Rolul este obligatoriu")
    private String role;
}