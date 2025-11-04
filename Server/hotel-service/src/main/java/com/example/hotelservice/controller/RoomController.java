package com.example.hotelservice.controller;

import com.example.hotelservice.entity.Room;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    @GetMapping("/status/{status}")
    public List<Room> getRoomsByStatus(@PathVariable String status) {
        return roomRepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow();
        room.setNumber(roomDetails.getNumber());
        room.setType(roomDetails.getType());
        room.setPrice(roomDetails.getPrice());
        room.setStatus(roomDetails.getStatus());
        return roomRepository.save(room);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(id).orElseThrow();
        room.setStatus(body.get("status"));
        Room updatedRoom = roomRepository.save(room);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
    }
}