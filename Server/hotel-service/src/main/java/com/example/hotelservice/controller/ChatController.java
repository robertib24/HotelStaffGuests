package com.example.hotelservice.controller;

import com.example.hotelservice.dto.ChatRequestDTO;
import com.example.hotelservice.dto.ChatResponseDTO;
import com.example.hotelservice.dto.HousekeepingRequestDTO;
import com.example.hotelservice.dto.RoomServiceRequestDTO;
import com.example.hotelservice.entity.HousekeepingRequest;
import com.example.hotelservice.entity.RoomServiceRequest;
import com.example.hotelservice.service.ChatService;
import com.example.hotelservice.service.HousekeepingRequestService;
import com.example.hotelservice.service.RoomServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
public class ChatController {

    private final ChatService chatService;
    private final RoomServiceRequestService roomServiceRequestService;
    private final HousekeepingRequestService housekeepingRequestService;

    public ChatController(ChatService chatService,
                         RoomServiceRequestService roomServiceRequestService,
                         HousekeepingRequestService housekeepingRequestService) {
        this.chatService = chatService;
        this.roomServiceRequestService = roomServiceRequestService;
        this.housekeepingRequestService = housekeepingRequestService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequestDTO request, Principal principal) {
        try {
            ChatResponseDTO response = chatService.processMessage(request.getMessage(), principal.getName());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la procesarea mesajului"));
        }
    }

    @PostMapping("/room-service-requests")
    public ResponseEntity<RoomServiceRequest> createRoomServiceRequest(
            @Valid @RequestBody RoomServiceRequestDTO request,
            Principal principal) {
        RoomServiceRequest created = roomServiceRequestService.createRequest(request, principal.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/room-service-requests")
    public ResponseEntity<List<RoomServiceRequest>> getMyRoomServiceRequests(Principal principal) {
        return ResponseEntity.ok(roomServiceRequestService.getRequestsByGuest(principal.getName()));
    }

    @PostMapping("/housekeeping-requests")
    public ResponseEntity<HousekeepingRequest> createHousekeepingRequest(
            @Valid @RequestBody HousekeepingRequestDTO request,
            Principal principal) {
        HousekeepingRequest created = housekeepingRequestService.createRequest(request, principal.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/housekeeping-requests")
    public ResponseEntity<List<HousekeepingRequest>> getMyHousekeepingRequests(Principal principal) {
        return ResponseEntity.ok(housekeepingRequestService.getRequestsByGuest(principal.getName()));
    }
}
