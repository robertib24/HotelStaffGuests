package com.example.hotelservice.controller;

import com.example.hotelservice.dto.ReservationDTO;
import com.example.hotelservice.dto.ReservationRequestDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;

    public ReservationController(ReservationRepository reservationRepository,
                                 GuestRepository guestRepository,
                                 RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(ReservationDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequestDTO request) {
        Guest guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + request.getGuestId()));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoomId()));

        if (request.getStartDate().isAfter(request.getEndDate()) || request.getStartDate().isEqual(request.getEndDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        long numberOfNights = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        double totalPrice = numberOfNights * room.getPrice();

        Reservation reservation = Reservation.builder()
                .guest(guest)
                .room(room)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .createdAt(LocalDate.now())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(savedReservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody ReservationRequestDTO request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        Guest guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + request.getGuestId()));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoomId()));

        if (request.getStartDate().isAfter(request.getEndDate()) || request.getStartDate().isEqual(request.getEndDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        long numberOfNights = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        double totalPrice = numberOfNights * room.getPrice();

        reservation.setGuest(guest);
        reservation.setRoom(room);
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setTotalPrice(totalPrice);

        Reservation updatedReservation = reservationRepository.save(reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        reservationRepository.delete(reservation);
        return ResponseEntity.noContent().build();
    }
}