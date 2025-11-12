package com.example.hotelservice.service;

import com.example.hotelservice.dto.ClientReservationRequestDTO;
import com.example.hotelservice.dto.ReservationDTO;
import com.example.hotelservice.dto.ReservationRequestDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.exception.InvalidRequestException;
import com.example.hotelservice.exception.ReservationConflictException;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    public ReservationService(ReservationRepository reservationRepository,
                              GuestRepository guestRepository,
                              RoomRepository roomRepository,
                              EmailService emailService,
                              SimpMessagingTemplate messagingTemplate) {
        this.reservationRepository = reservationRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(ReservationDTO::new)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getReservationsByGuestEmail(String email) {
        return reservationRepository.findByGuestEmail(email).stream()
                .map(ReservationDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationDTO createReservation(ReservationRequestDTO request) {
        Guest guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele cu id " + request.getGuestId() + " nu a fost găsit."));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Camera cu id " + request.getRoomId() + " nu a fost găsită."));

        validateReservationDates(request.getStartDate(), request.getEndDate());
        checkForOverlappingReservations(request.getRoomId(), request.getStartDate(), request.getEndDate(), null);

        Reservation reservation = buildReservation(guest, room, request.getStartDate(), request.getEndDate());
        Reservation savedReservation = reservationRepository.save(reservation);

        emailService.sendReservationConfirmation(savedReservation);

        messagingTemplate.convertAndSend("/topic/reservations", new ReservationDTO(savedReservation));

        return new ReservationDTO(savedReservation);
    }

    @Transactional
    public ReservationDTO createReservationForClient(ClientReservationRequestDTO request, String guestEmail) {
        Guest guest = guestRepository.findByEmail(guestEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele cu email " + guestEmail + " nu a fost găsit."));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Camera cu id " + request.getRoomId() + " nu a fost găsită."));

        validateReservationDates(request.getStartDate(), request.getEndDate());
        checkForOverlappingReservations(request.getRoomId(), request.getStartDate(), request.getEndDate(), null);

        Reservation reservation = buildReservation(guest, room, request.getStartDate(), request.getEndDate());
        Reservation savedReservation = reservationRepository.save(reservation);

        emailService.sendReservationConfirmation(savedReservation);

        messagingTemplate.convertAndSend("/topic/reservations", new ReservationDTO(savedReservation));

        return new ReservationDTO(savedReservation);
    }

    @Transactional
    public ReservationDTO updateReservation(Long id, ReservationRequestDTO request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervarea cu id " + id + " nu a fost găsită."));

        Guest guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele cu id " + request.getGuestId() + " nu a fost găsit."));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Camera cu id " + request.getRoomId() + " nu a fost găsită."));

        validateReservationDates(request.getStartDate(), request.getEndDate());
        checkForOverlappingReservations(request.getRoomId(), request.getStartDate(), request.getEndDate(), id);

        long numberOfNights = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        double totalPrice = numberOfNights * room.getPrice();

        reservation.setGuest(guest);
        reservation.setRoom(room);
        reservation.setStartDate(request.getStartDate());
        reservation.setEndDate(request.getEndDate());
        reservation.setTotalPrice(totalPrice);

        Reservation savedReservation = reservationRepository.save(reservation);

        emailService.sendReservationConfirmation(savedReservation);

        return new ReservationDTO(savedReservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervarea cu id " + id + " nu a fost găsită."));

        Room room = reservation.getRoom();
        room.setStatus("Necesită Curățenie");
        roomRepository.save(room);

        emailService.sendReservationCancellation(reservation);

        reservationRepository.delete(reservation);
    }

    @Transactional
    public void deleteReservationForClient(Long id, String guestEmail) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervarea cu id " + id + " nu a fost găsită."));

        if (!reservation.getGuest().getEmail().equals(guestEmail)) {
            throw new InvalidRequestException("Nu aveți permisiunea să anulați această rezervare.");
        }

        Room room = reservation.getRoom();
        room.setStatus("Necesită Curățenie");
        roomRepository.save(room);

        emailService.sendReservationCancellation(reservation);

        reservationRepository.delete(reservation);
    }

    private void validateReservationDates(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate) || startDate.isEqual(endDate)) {
            throw new InvalidRequestException("Data de sfârșit trebuie să fie după data de început.");
        }
    }

    private void checkForOverlappingReservations(Long roomId, LocalDate startDate, LocalDate endDate, Long currentReservationId) {
        long overlappingCount = reservationRepository.countOverlappingReservations(roomId, startDate, endDate, currentReservationId);
        if (overlappingCount > 0) {
            throw new ReservationConflictException("Camera este deja rezervată în acest interval.");
        }
    }

    private Reservation buildReservation(Guest guest, Room room, LocalDate startDate, LocalDate endDate) {
        long numberOfNights = ChronoUnit.DAYS.between(startDate, endDate);
        double totalPrice = numberOfNights * room.getPrice();

        Reservation reservation = Reservation.builder()
                .guest(guest)
                .room(room)
                .startDate(startDate)
                .endDate(endDate)
                .totalPrice(totalPrice)
                .createdAt(LocalDate.now())
                .build();

        return reservation;
    }
}