package com.example.hotelservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rooms")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Numărul camerei este obligatoriu")
    @Column(nullable = false)
    private String number;

    @NotBlank(message = "Tipul camerei este obligatoriu")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Prețul este obligatoriu")
    @Min(value = 1, message = "Prețul trebuie să fie pozitiv")
    @Column(nullable = false)
    private double price;

    @Column(nullable = false, columnDefinition = "VARCHAR(255) default 'Curat'")
    private String status = "Curat";

    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee managedByEmployee;

}