package com.example.hotelservice.controller;

import com.example.hotelservice.dto.ClientReservationRequestDTO;
import com.example.hotelservice.dto.ReservationDTO;
import com.example.hotelservice.dto.ReservationRequestDTO;
import com.example.hotelservice.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/api/reservations")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PostMapping("/api/reservations")
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationRequestDTO request) {
        ReservationDTO savedReservation = reservationService.createReservation(request);
        return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
    }

    @PutMapping("/api/reservations/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable Long id, @Valid @RequestBody ReservationRequestDTO request) {
        ReservationDTO updatedReservation = reservationService.updateReservation(id, request);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/api/reservations/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/client/my-reservations")
    public ResponseEntity<List<ReservationDTO>> getMyReservations(Principal principal) {
        List<ReservationDTO> reservations = reservationService.getReservationsByGuestEmail(principal.getName());
        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/api/client/reservations")
    public ResponseEntity<ReservationDTO> createClientReservation(@Valid @RequestBody ClientReservationRequestDTO request, Principal principal) {
        ReservationDTO savedReservation = reservationService.createReservationForClient(request, principal.getName());
        return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
    }

    @DeleteMapping("/api/client/my-reservations/{id}")
    public ResponseEntity<Void> deleteClientReservation(@PathVariable Long id, Principal principal) {
        reservationService.deleteReservationForClient(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}