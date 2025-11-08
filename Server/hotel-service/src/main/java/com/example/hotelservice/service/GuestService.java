package com.example.hotelservice.service;

import com.example.hotelservice.dto.GuestProfileDTO;
import com.example.hotelservice.dto.GuestProfileUpdateDTO;
import com.example.hotelservice.dto.GuestsPerRoomTypeDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.exception.DuplicateResourceException;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestService {

    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    public GuestService(GuestRepository guestRepository,
                        ReservationRepository reservationRepository,
                        PasswordEncoder passwordEncoder) {
        this.guestRepository = guestRepository;
        this.reservationRepository = reservationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Guest createGuest(Guest guest) {
        guestRepository.findByEmail(guest.getEmail())
                .ifPresent(g -> {
                    throw new DuplicateResourceException("Email-ul este deja folosit de alt oaspete.");
                });
        return guestRepository.save(guest);
    }

    public List<Guest> getAllGuests() {
        return guestRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele cu id " + id + " nu a fost găsit."));
    }

    public Guest updateGuest(Long id, Guest guestDetails) {
        Guest guest = getGuestById(id);

        guestRepository.findByEmail(guestDetails.getEmail())
                .ifPresent(existingGuest -> {
                    if (!existingGuest.getId().equals(id)) {
                        throw new DuplicateResourceException("Email-ul este deja folosit de alt oaspete.");
                    }
                });

        guest.setName(guestDetails.getName());
        guest.setEmail(guestDetails.getEmail());
        return guestRepository.save(guest);
    }

    public void deleteGuest(Long id) {
        if (!guestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Oaspetele cu id " + id + " nu a fost găsit.");
        }
        guestRepository.deleteById(id);
    }

    public List<GuestsPerRoomTypeDTO> getGuestsPerRoomType() {
        return reservationRepository.getGuestsPerRoomType().stream()
                .map(result -> new GuestsPerRoomTypeDTO((String) result[0], (String) result[1], (String) result[2]))
                .collect(Collectors.toList());
    }

    public GuestProfileDTO getGuestProfileByEmail(String email) {
        Guest guest = guestRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele nu a fost găsit."));
        return new GuestProfileDTO(guest);
    }

    @Transactional
    public GuestProfileDTO updateGuestProfile(String email, GuestProfileUpdateDTO updateDTO) {
        Guest guest = guestRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele nu a fost găsit."));

        guest.setName(updateDTO.getName());

        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
            guest.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }

        Guest savedGuest = guestRepository.save(guest);
        return new GuestProfileDTO(savedGuest);
    }
}