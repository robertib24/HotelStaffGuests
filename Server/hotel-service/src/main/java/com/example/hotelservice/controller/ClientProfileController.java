package com.example.hotelservice.controller;

import com.example.hotelservice.dto.GuestProfileDTO;
import com.example.hotelservice.dto.GuestProfileUpdateDTO;
import com.example.hotelservice.service.GuestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/client/profile")
public class ClientProfileController {

    private final GuestService guestService;

    public ClientProfileController(GuestService guestService) {
        this.guestService = guestService;
    }

    @GetMapping
    public ResponseEntity<GuestProfileDTO> getMyProfile(Principal principal) {
        return ResponseEntity.ok(guestService.getGuestProfileByEmail(principal.getName()));
    }

    @PutMapping
    public ResponseEntity<GuestProfileDTO> updateMyProfile(
            @Valid @RequestBody GuestProfileUpdateDTO updateDTO,
            Principal principal) {
        return ResponseEntity.ok(guestService.updateGuestProfile(principal.getName(), updateDTO));
    }
}