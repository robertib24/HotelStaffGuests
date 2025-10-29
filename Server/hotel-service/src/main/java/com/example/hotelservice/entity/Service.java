package com.example.hotelservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // ex: "acces spa", "mic dejun gratuit"

    private String description;

    @Column(nullable = false)
    private double price;

    @ManyToMany(mappedBy = "services")
    private Set<Guest> guests = new HashSet<>();
}