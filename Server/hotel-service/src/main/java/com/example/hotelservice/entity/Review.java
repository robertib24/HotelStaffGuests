package com.example.hotelservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Min(value = 1, message = "Rating-ul trebuie să fie minim 1")
    @Max(value = 5, message = "Rating-ul trebuie să fie maxim 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Comentariul este obligatoriu")
    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(length = 1000)
    private String staffResponse;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime respondedAt;

    @Column(length = 100)
    private String respondedBy; // Staff member name who responded

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}