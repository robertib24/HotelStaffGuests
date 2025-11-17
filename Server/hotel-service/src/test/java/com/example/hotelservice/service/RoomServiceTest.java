package com.example.hotelservice.service;

import com.example.hotelservice.entity.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
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
    void createRoom_shouldSaveAndReturnRoom() {
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room result = roomService.createRoom(room);

        assertNotNull(result);
        assertEquals("101", result.getNumber());
        verify(roomRepository).save(any(Room.class));
    }

    @Test
    void getAllRooms_shouldReturnAllRooms() {
        Room room2 = new Room();
        room2.setId(2L);
        room2.setNumber("102");
        room2.setType("Deluxe");
        room2.setPrice(150.0);
        room2.setStatus("Disponibilă");

        when(roomRepository.findAll(any(Sort.class))).thenReturn(Arrays.asList(room, room2));

        List<Room> result = roomService.getAllRooms();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(roomRepository).findAll(any(Sort.class));
    }

    @Test
    void getRoomById_withValidId_shouldReturnRoom() {
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));

        Room result = roomService.getRoomById(1L);

        assertNotNull(result);
        assertEquals("101", result.getNumber());
        verify(roomRepository).findById(1L);
    }

    @Test
    void getRoomById_withInvalidId_shouldThrowException() {
        when(roomRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            roomService.getRoomById(1L);
        });
    }

    @Test
    void getRoomsByStatus_shouldReturnFilteredRooms() {
        when(roomRepository.findByStatus(anyString(), any(Sort.class))).thenReturn(Arrays.asList(room));

        List<Room> result = roomService.getRoomsByStatus("Disponibilă");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Disponibilă", result.get(0).getStatus());
        verify(roomRepository).findByStatus(eq("Disponibilă"), any(Sort.class));
    }

    @Test
    void updateRoom_withValidData_shouldUpdateRoom() {
        Room updatedRoom = new Room();
        updatedRoom.setNumber("102");
        updatedRoom.setType("Deluxe");
        updatedRoom.setPrice(150.0);
        updatedRoom.setStatus("Ocupată");

        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room result = roomService.updateRoom(1L, updatedRoom);

        assertNotNull(result);
        verify(roomRepository).save(any(Room.class));
        verify(roomRepository).findById(1L);
    }

    @Test
    void updateRoom_withInvalidId_shouldThrowException() {
        Room updatedRoom = new Room();
        updatedRoom.setNumber("102");

        when(roomRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            roomService.updateRoom(1L, updatedRoom);
        });

        verify(roomRepository, never()).save(any());
    }

    @Test
    void updateRoomStatus_withValidData_shouldUpdateStatus() {
        Map<String, String> statusUpdate = Map.of("status", "Ocupată");

        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(room));
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room result = roomService.updateRoomStatus(1L, statusUpdate);

        assertNotNull(result);
        verify(roomRepository).save(any(Room.class));
    }

    @Test
    void deleteRoom_withValidId_shouldDeleteRoom() {
        when(roomRepository.existsById(anyLong())).thenReturn(true);

        roomService.deleteRoom(1L);

        verify(roomRepository).deleteById(1L);
        verify(roomRepository).existsById(1L);
    }

    @Test
    void deleteRoom_withInvalidId_shouldThrowException() {
        when(roomRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            roomService.deleteRoom(1L);
        });

        verify(roomRepository, never()).deleteById(anyLong());
    }
}
