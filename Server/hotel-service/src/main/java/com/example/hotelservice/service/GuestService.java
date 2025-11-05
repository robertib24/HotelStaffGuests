package com.example.hotelservice.service;

import com.example.hotelservice.dto.GuestsPerRoomTypeDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.exception.DuplicateResourceException;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestService {

    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;

    public GuestService(GuestRepository guestRepository, ReservationRepository reservationRepository) {
        this.guestRepository = guestRepository;
        this.reservationRepository = reservationRepository;
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
}