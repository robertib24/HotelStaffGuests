package com.example.hotelservice.service;

import com.example.hotelservice.dto.HousekeepingRequestDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.HousekeepingRequest;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.HousekeepingRequestRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HousekeepingRequestService {

    private final HousekeepingRequestRepository requestRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    public HousekeepingRequestService(HousekeepingRequestRepository requestRepository,
                                      GuestRepository guestRepository,
                                      RoomRepository roomRepository,
                                      SimpMessagingTemplate messagingTemplate,
                                      EmailService emailService) {
        this.requestRepository = requestRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
        this.emailService = emailService;
    }

    @Transactional
    public HousekeepingRequest createRequest(HousekeepingRequestDTO dto, String userEmail) {
        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        HousekeepingRequest request = HousekeepingRequest.builder()
                .guest(guest)
                .room(room)
                .requestType(dto.getRequestType())
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : "NORMAL")
                .status("PENDING")
                .build();

        HousekeepingRequest saved = requestRepository.save(request);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "HOUSEKEEPING_REQUEST");
        notification.put("title", "Cerere Housekeeping Nouă");
        notification.put("message", guest.getName() + " - Camera " + room.getNumber() + ": " + dto.getRequestType());
        notification.put("data", saved);

        messagingTemplate.convertAndSend("/topic/notifications", notification);

        return saved;
    }

    public List<HousekeepingRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<HousekeepingRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<HousekeepingRequest> getRequestsByRoom(Long roomId) {
        return requestRepository.findByRoomIdOrderByCreatedAtDesc(roomId);
    }

    public List<HousekeepingRequest> getRequestsByGuest(String userEmail) {
        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        return requestRepository.findByGuestIdOrderByCreatedAtDesc(guest.getId());
    }

    @Transactional
    public HousekeepingRequest updateStatus(Long id, String status) {
        HousekeepingRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String oldStatus = request.getStatus();
        request.setStatus(status);

        if ("COMPLETED".equals(status)) {
            request.setCompletedAt(LocalDateTime.now());
        }

        HousekeepingRequest saved = requestRepository.save(request);

        emailService.sendHousekeepingStatusUpdate(saved, oldStatus, status);

        return saved;
    }
}
