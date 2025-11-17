package com.example.hotelservice.controller;

import com.example.hotelservice.entity.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
@AutoConfigureMockMvc(addFilters = false)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RoomService roomService;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId(1L);
        room.setNumber("101");
        room.setType("Standard");
        room.setPrice(100.0);
        room.setStatus("Disponibilă");
    }

    @Test
    void getAllRooms_shouldReturnRoomsList() throws Exception {
        List<Room> rooms = Arrays.asList(room);
        when(roomService.getAllRooms()).thenReturn(rooms);

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].number").value("101"));
    }

    @Test
    void getRoomById_withValidId_shouldReturnRoom() throws Exception {
        when(roomService.getRoomById(anyLong())).thenReturn(room);

        mockMvc.perform(get("/api/rooms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.number").value("101"));
    }

    @Test
    void getRoomById_withInvalidId_shouldReturnNotFound() throws Exception {
        when(roomService.getRoomById(anyLong()))
                .thenThrow(new ResourceNotFoundException("Camera nu a fost găsită"));

        mockMvc.perform(get("/api/rooms/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createRoom_withValidData_shouldReturnCreated() throws Exception {
        when(roomService.createRoom(any(Room.class))).thenReturn(room);

        mockMvc.perform(post("/api/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(room)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.number").value("101"));
    }

    @Test
    void updateRoom_withValidData_shouldReturnUpdatedRoom() throws Exception {
        when(roomService.updateRoom(anyLong(), any(Room.class))).thenReturn(room);

        mockMvc.perform(put("/api/rooms/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(room)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.number").value("101"));
    }

    @Test
    void updateRoomStatus_withValidData_shouldReturnUpdatedRoom() throws Exception {
        Map<String, String> statusUpdate = Map.of("status", "Ocupată");
        when(roomService.updateRoomStatus(anyLong(), anyMap())).thenReturn(room);

        mockMvc.perform(patch("/api/rooms/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deleteRoom_withValidId_shouldReturnNoContent() throws Exception {
        doNothing().when(roomService).deleteRoom(anyLong());

        mockMvc.perform(delete("/api/rooms/1"))
                .andExpect(status().isNoContent());

        verify(roomService).deleteRoom(1L);
    }

    @Test
    void deleteRoom_withInvalidId_shouldReturnNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Camera nu a fost găsită"))
                .when(roomService).deleteRoom(anyLong());

        mockMvc.perform(delete("/api/rooms/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getRoomsByStatus_shouldReturnFilteredRooms() throws Exception {
        List<Room> rooms = Arrays.asList(room);
        when(roomService.getRoomsByStatus(anyString())).thenReturn(rooms);

        mockMvc.perform(get("/api/rooms/status/Disponibilă"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("Disponibilă"));
    }
}
