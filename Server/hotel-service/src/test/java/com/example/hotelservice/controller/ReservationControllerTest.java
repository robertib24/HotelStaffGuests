package com.example.hotelservice.controller;

import com.example.hotelservice.dto.ReservationDTO;
import com.example.hotelservice.dto.ReservationRequestDTO;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.service.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReservationService reservationService;

    private ReservationDTO reservationDTO;
    private ReservationRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        reservationDTO = new ReservationDTO();
        reservationDTO.setId(1L);
        reservationDTO.setGuestId(1L);
        reservationDTO.setGuestName("John Doe");
        reservationDTO.setRoomId(1L);
        reservationDTO.setRoomNumber("101");
        reservationDTO.setRoomType("Standard");
        reservationDTO.setStartDate(LocalDate.now().plusDays(1));
        reservationDTO.setEndDate(LocalDate.now().plusDays(3));
        reservationDTO.setTotalPrice(200.0);
        reservationDTO.setReservationCode("TEST123");

        requestDTO = new ReservationRequestDTO();
        requestDTO.setGuestId(1L);
        requestDTO.setRoomId(1L);
        requestDTO.setStartDate(LocalDate.now().plusDays(1));
        requestDTO.setEndDate(LocalDate.now().plusDays(3));
    }

    @Test
    void getAllReservations_shouldReturnReservationsList() throws Exception {
        List<ReservationDTO> reservations = Arrays.asList(reservationDTO);
        when(reservationService.getAllReservations()).thenReturn(reservations);

        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].guestName").value("John Doe"));
    }

    @Test
    void createReservation_withValidData_shouldReturnCreated() throws Exception {
        when(reservationService.createReservation(any(ReservationRequestDTO.class)))
                .thenReturn(reservationDTO);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.guestName").value("John Doe"));
    }

    @Test
    void createReservation_withInvalidData_shouldReturnBadRequest() throws Exception {
        requestDTO.setGuestId(null);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateReservation_withValidData_shouldReturnUpdatedReservation() throws Exception {
        when(reservationService.updateReservation(anyLong(), any(ReservationRequestDTO.class)))
                .thenReturn(reservationDTO);

        mockMvc.perform(put("/api/reservations/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateReservation_withInvalidId_shouldReturnNotFound() throws Exception {
        when(reservationService.updateReservation(anyLong(), any(ReservationRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Rezervarea nu a fost găsită"));

        mockMvc.perform(put("/api/reservations/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReservation_withValidId_shouldReturnNoContent() throws Exception {
        doNothing().when(reservationService).deleteReservation(anyLong());

        mockMvc.perform(delete("/api/reservations/1"))
                .andExpect(status().isNoContent());

        verify(reservationService).deleteReservation(1L);
    }

    @Test
    void deleteReservation_withInvalidId_shouldReturnNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Rezervarea nu a fost găsită"))
                .when(reservationService).deleteReservation(anyLong());

        mockMvc.perform(delete("/api/reservations/999"))
                .andExpect(status().isNotFound());
    }
}
