package com.example.hotelservice.controller.auth;

import com.example.hotelservice.dto.auth.AuthRequestDTO;
import com.example.hotelservice.dto.auth.AuthResponseDTO;
import com.example.hotelservice.dto.auth.GuestRegisterDTO;
import com.example.hotelservice.service.GuestAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client/auth")
public class ClientAuthController {

    private final GuestAuthService guestAuthService;

    public ClientAuthController(GuestAuthService guestAuthService) {
        this.guestAuthService = guestAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody GuestRegisterDTO request) {
        return ResponseEntity.ok(guestAuthService.registerGuest(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        return ResponseEntity.ok(guestAuthService.loginGuest(request));
    }
}