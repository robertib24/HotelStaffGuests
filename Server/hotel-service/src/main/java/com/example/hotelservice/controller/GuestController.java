package com.example.hotelservice.controller;

import com.example.hotelservice.dto.GuestsPerRoomTypeDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    @PostMapping
    public Guest createGuest(@RequestBody Guest guest) {
        if (guest.getCheckInDate() == null) {
            guest.setCheckInDate(LocalDate.now());
        }
        return guestRepository.save(guest);
    }

    @GetMapping
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    @GetMapping("/{id}")
    public Guest getGuestById(@PathVariable Long id) {
        return guestRepository.findById(id).orElse(null);
    }

    @GetMapping("/reports/by-room-type")
    public List<GuestsPerRoomTypeDTO> getGuestsPerRoomType() {
        return guestRepository.getGuestsPerRoomType().stream()
                .map(result -> new GuestsPerRoomTypeDTO((String) result[0], (String) result[1], (String) result[2]))
                .collect(Collectors.toList());
    }
}