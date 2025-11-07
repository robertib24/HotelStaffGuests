package com.example.hotelservice.service;

import com.example.hotelservice.dto.auth.AuthRequestDTO;
import com.example.hotelservice.dto.auth.AuthResponseDTO;
import com.example.hotelservice.dto.auth.GuestRegisterDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.exception.DuplicateResourceException;
import com.example.hotelservice.repository.GuestRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GuestAuthService {

    private final GuestRepository guestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public GuestAuthService(GuestRepository guestRepository,
                            PasswordEncoder passwordEncoder,
                            JwtService jwtService,
                            AuthenticationManager authenticationManager) {
        this.guestRepository = guestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponseDTO registerGuest(GuestRegisterDTO request) {
        if (guestRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email-ul este deja folosit.");
        }

        Guest guest = new Guest();
        guest.setName(request.getName());
        guest.setEmail(request.getEmail());
        guest.setPassword(passwordEncoder.encode(request.getPassword()));

        guestRepository.save(guest);

        return generateAuthResponse(guest);
    }

    public AuthResponseDTO loginGuest(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = guestRepository.findByEmail(request.getEmail())
                .orElseThrow();

        return generateAuthResponse(userDetails);
    }

    private AuthResponseDTO generateAuthResponse(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList()));

        if (userDetails instanceof Guest) {
            claims.put("name", ((Guest) userDetails).getName());
        }

        String token = jwtService.generateToken(claims, userDetails);
        return new AuthResponseDTO(token);
    }
}