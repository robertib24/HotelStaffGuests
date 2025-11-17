package com.example.hotelservice.service;

import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.ReservationRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public RoomService(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camera cu id " + id + " nu a fost găsită."));
    }

    public List<Room> getRoomsByStatus(String status) {
        return roomRepository.findByStatus(status, Sort.by(Sort.Direction.ASC, "id"));
    }

    public Room updateRoom(Long id, Room roomDetails) {
        Room room = getRoomById(id);
        room.setNumber(roomDetails.getNumber());
        room.setType(roomDetails.getType());
        room.setPrice(roomDetails.getPrice());
        room.setStatus(roomDetails.getStatus());
        return roomRepository.save(room);
    }

    public Room updateRoomStatus(Long id, Map<String, String> body) {
        Room room = getRoomById(id);
        room.setStatus(body.get("status"));
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Camera cu id " + id + " nu a fost găsită.");
        }
        roomRepository.deleteById(id);
    }

    @Transactional
    public void syncRoomStatusWithReservations() {
        LocalDate today = LocalDate.now();
        List<Reservation> activeReservations = reservationRepository.findAll().stream()
                .filter(r -> !r.getStartDate().isAfter(today) && r.getEndDate().isAfter(today))
                .collect(Collectors.toList());

        Set<Long> occupiedRoomIds = activeReservations.stream()
                .map(r -> r.getRoom().getId())
                .collect(Collectors.toSet());

        for (Reservation reservation : activeReservations) {
            Room room = reservation.getRoom();
            if (!"Ocupat".equals(room.getStatus())) {
                room.setStatus("Ocupat");
                roomRepository.save(room);
            }
        }
    }
}