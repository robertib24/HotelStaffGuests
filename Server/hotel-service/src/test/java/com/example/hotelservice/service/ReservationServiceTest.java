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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private GuestRepository guestRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ReservationService reservationService;

    private Guest guest;
    private Room room;
    private Reservation reservation;
    private ReservationRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        guest = new Guest();
        guest.setId(1L);
        guest.setName("John Doe");
        guest.setEmail("john@example.com");

        room = new Room();
        room.setId(1L);
        room.setNumber("101");
        room.setType("Standard");
        room.setPrice(100.0);
        room.setStatus("Disponibilă");

        reservation = Reservation.builder()
                .id(1L)
                .guest(guest)
                .room(room)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(3))
                .totalPrice(200.0)
                .reservationCode("TEST123")
                .createdAt(LocalDate.now())
                .build();

        requestDTO = new ReservationRequestDTO();
        requestDTO.setGuestId(1L);
        requestDTO.setRoomId(1L);
        requestDTO.setStartDate(LocalDate.now().plusDays(1));
        requestDTO.setEndDate(LocalDate.now().plusDays(3));
    }

    @Test
    void getAllReservations_shouldReturnAllReservations() {
        when(reservationRepository.findAll(any())).thenReturn(Arrays.asList(reservation));

        List<ReservationDTO> result = reservationService.getAllReservations();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reservationRepository).findAll(any());
    }

    @Test
    void getReservationsByGuestEmail_shouldReturnGuestReservations() {
        when(reservationRepository.findByGuestEmail(anyString())).thenReturn(Arrays.asList(reservation));

        List<ReservationDTO> result = reservationService.getReservationsByGuestEmail("john@example.com");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reservationRepository).findByGuestEmail("john@example.com");
    }

    @Test
    void createReservation_withValidData_shouldCreateReservation() {
        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(reservationRepository.countOverlappingReservations(anyLong(), any(), any(), any())).thenReturn(0L);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);
        doNothing().when(emailService).sendReservationConfirmation(any());
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any());

        ReservationDTO result = reservationService.createReservation(requestDTO);

        assertNotNull(result);
        verify(reservationRepository).save(any(Reservation.class));
        verify(emailService).sendReservationConfirmation(any());
    }

    @Test
    void createReservation_withInvalidGuest_shouldThrowException() {
        when(guestRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.createReservation(requestDTO);
        });

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createReservation_withInvalidRoom_shouldThrowException() {
        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.createReservation(requestDTO);
        });

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createReservation_withInvalidDates_shouldThrowException() {
        requestDTO.setStartDate(LocalDate.now().plusDays(3));
        requestDTO.setEndDate(LocalDate.now().plusDays(1));

        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));

        assertThrows(InvalidRequestException.class, () -> {
            reservationService.createReservation(requestDTO);
        });

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createReservation_withSameDates_shouldThrowException() {
        LocalDate sameDate = LocalDate.now().plusDays(1);
        requestDTO.setStartDate(sameDate);
        requestDTO.setEndDate(sameDate);

        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));

        assertThrows(InvalidRequestException.class, () -> {
            reservationService.createReservation(requestDTO);
        });

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createReservation_withOverlappingReservation_shouldThrowException() {
        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(reservationRepository.countOverlappingReservations(anyLong(), any(), any(), any())).thenReturn(1L);

        assertThrows(ReservationConflictException.class, () -> {
            reservationService.createReservation(requestDTO);
        });

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void updateReservation_withValidData_shouldUpdateReservation() {
        when(reservationRepository.findById(anyLong())).thenReturn(Optional.of(reservation));
        when(guestRepository.findById(anyLong())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(reservationRepository.countOverlappingReservations(anyLong(), any(), any(), any())).thenReturn(0L);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);
        doNothing().when(emailService).sendReservationConfirmation(any());

        ReservationDTO result = reservationService.updateReservation(1L, requestDTO);

        assertNotNull(result);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void deleteReservation_withValidId_shouldDeleteReservation() {
        when(reservationRepository.findById(anyLong())).thenReturn(Optional.of(reservation));
        when(roomRepository.save(any(Room.class))).thenReturn(room);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any());
        doNothing().when(emailService).sendReservationCancellation(any());
        doNothing().when(reservationRepository).delete(any(Reservation.class));

        reservationService.deleteReservation(1L);

        verify(reservationRepository).delete(any(Reservation.class));
        verify(emailService).sendReservationCancellation(any());
        verify(roomRepository).save(any(Room.class));
    }

    @Test
    void deleteReservation_withInvalidId_shouldThrowException() {
        when(reservationRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            reservationService.deleteReservation(1L);
        });

        verify(reservationRepository, never()).delete(any());
    }

    @Test
    void createReservationForClient_withValidData_shouldCreateReservation() {
        ClientReservationRequestDTO clientRequest = new ClientReservationRequestDTO();
        clientRequest.setRoomId(1L);
        clientRequest.setStartDate(LocalDate.now().plusDays(1));
        clientRequest.setEndDate(LocalDate.now().plusDays(3));

        when(guestRepository.findByEmail(anyString())).thenReturn(Optional.of(guest));
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(reservationRepository.countOverlappingReservations(anyLong(), any(), any(), any())).thenReturn(0L);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);
        doNothing().when(emailService).sendReservationConfirmation(any());
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any());

        ReservationDTO result = reservationService.createReservationForClient(clientRequest, "john@example.com");

        assertNotNull(result);
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void deleteReservationForClient_withValidData_shouldDeleteReservation() {
        when(reservationRepository.findById(anyLong())).thenReturn(Optional.of(reservation));
        when(roomRepository.save(any(Room.class))).thenReturn(room);
        doNothing().when(messagingTemplate).convertAndSend(anyString(), any());
        doNothing().when(emailService).sendReservationCancellation(any());
        doNothing().when(reservationRepository).delete(any(Reservation.class));

        reservationService.deleteReservationForClient(1L, "john@example.com");

        verify(reservationRepository).delete(any(Reservation.class));
        verify(roomRepository).save(any(Room.class));
    }

    @Test
    void deleteReservationForClient_withWrongEmail_shouldThrowException() {
        when(reservationRepository.findById(anyLong())).thenReturn(Optional.of(reservation));

        assertThrows(InvalidRequestException.class, () -> {
            reservationService.deleteReservationForClient(1L, "wrong@example.com");
        });

        verify(reservationRepository, never()).delete(any());
    }
}
