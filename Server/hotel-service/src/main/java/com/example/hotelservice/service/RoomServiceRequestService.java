package com.example.hotelservice.service;

import com.example.hotelservice.dto.RoomServiceRequestDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.entity.RoomServiceRequest;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.RoomRepository;
import com.example.hotelservice.repository.RoomServiceRequestRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoomServiceRequestService {

    private final RoomServiceRequestRepository requestRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public RoomServiceRequestService(RoomServiceRequestRepository requestRepository,
                                     GuestRepository guestRepository,
                                     RoomRepository roomRepository,
                                     SimpMessagingTemplate messagingTemplate) {
        this.requestRepository = requestRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public RoomServiceRequest createRequest(RoomServiceRequestDTO dto, String userEmail) {
        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        Room room = null;
        if (dto.getRoomId() != null) {
            room = roomRepository.findById(dto.getRoomId()).orElse(null);
        }

        RoomServiceRequest request = RoomServiceRequest.builder()
                .guest(guest)
                .room(room)
                .request(dto.getRequest())
                .notes(dto.getNotes())
                .status("PENDING")
                .build();

        RoomServiceRequest saved = requestRepository.save(request);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "ROOM_SERVICE_REQUEST");
        notification.put("title", "Cerere Room Service Nouă");
        notification.put("message", guest.getName() + " a solicitat: " + dto.getRequest());
        notification.put("data", saved);

        messagingTemplate.convertAndSend("/topic/notifications", notification);

        return saved;
    }

    public List<RoomServiceRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<RoomServiceRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<RoomServiceRequest> getRequestsByGuest(String userEmail) {
        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        return requestRepository.findByGuestIdOrderByCreatedAtDesc(guest.getId());
    }

    @Transactional
    public RoomServiceRequest updateStatus(Long id, String status) {
        RoomServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);

        if ("COMPLETED".equals(status)) {
            request.setCompletedAt(LocalDateTime.now());
        }

        return requestRepository.save(request);
    }
}
