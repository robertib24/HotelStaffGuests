package com.example.hotelservice.controller;

import com.example.hotelservice.dto.GuestsPerRoomTypeDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping
    public Guest createGuest(@RequestBody Guest guest) {
        return guestRepository.save(guest);
    }

    @GetMapping
    public List<Guest> getAllGuests() {
        return guestRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping("/{id}")
    public Guest getGuestById(@PathVariable Long id) {
        return guestRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Guest updateGuest(@PathVariable Long id, @RequestBody Guest guestDetails) {
        Guest guest = guestRepository.findById(id).orElseThrow();
        guest.setName(guestDetails.getName());
        guest.setEmail(guestDetails.getEmail());
        return guestRepository.save(guest);
    }

    @DeleteMapping("/{id}")
    public void deleteGuest(@PathVariable Long id) {
        guestRepository.deleteById(id);
    }

    @GetMapping("/reports/by-room-type")
    public List<GuestsPerRoomTypeDTO> getGuestsPerRoomType() {
        return reservationRepository.getGuestsPerRoomType().stream()
                .map(result -> new GuestsPerRoomTypeDTO((String) result[0], (String) result[1], (String) result[2]))
                .collect(Collectors.toList());
    }
}