package com.example.hotelservice.controller;

import com.example.hotelservice.dto.GuestsPerRoomTypeDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.service.GuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @PostMapping
    public ResponseEntity<Guest> createGuest(@Valid @RequestBody Guest guest) {
        return new ResponseEntity<>(guestService.createGuest(guest), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Guest>> getAllGuests() {
        return ResponseEntity.ok(guestService.getAllGuests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return ResponseEntity.ok(guestService.getGuestById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(@PathVariable Long id, @Valid @RequestBody Guest guestDetails) {
        return ResponseEntity.ok(guestService.updateGuest(id, guestDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports/by-room-type")
    public ResponseEntity<List<GuestsPerRoomTypeDTO>> getGuestsPerRoomType() {
        return ResponseEntity.ok(guestService.getGuestsPerRoomType());
    }
}