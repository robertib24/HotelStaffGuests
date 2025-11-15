package com.example.hotelservice.controller;

import com.example.hotelservice.entity.HousekeepingRequest;
import com.example.hotelservice.entity.RoomServiceRequest;
import com.example.hotelservice.service.HousekeepingRequestService;
import com.example.hotelservice.service.RoomServiceRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
public class StaffRequestsController {

    private final RoomServiceRequestService roomServiceRequestService;
    private final HousekeepingRequestService housekeepingRequestService;

    public StaffRequestsController(RoomServiceRequestService roomServiceRequestService,
                                  HousekeepingRequestService housekeepingRequestService) {
        this.roomServiceRequestService = roomServiceRequestService;
        this.housekeepingRequestService = housekeepingRequestService;
    }

    @GetMapping("/room-service-requests")
    public ResponseEntity<List<RoomServiceRequest>> getAllRoomServiceRequests() {
        return ResponseEntity.ok(roomServiceRequestService.getAllRequests());
    }

    @GetMapping("/room-service-requests/status/{status}")
    public ResponseEntity<List<RoomServiceRequest>> getRoomServiceRequestsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(roomServiceRequestService.getRequestsByStatus(status));
    }

    @PatchMapping("/room-service-requests/{id}/status")
    public ResponseEntity<RoomServiceRequest> updateRoomServiceRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(roomServiceRequestService.updateStatus(id, status));
    }

    @GetMapping("/housekeeping-requests")
    public ResponseEntity<List<HousekeepingRequest>> getAllHousekeepingRequests() {
        return ResponseEntity.ok(housekeepingRequestService.getAllRequests());
    }

    @GetMapping("/housekeeping-requests/status/{status}")
    public ResponseEntity<List<HousekeepingRequest>> getHousekeepingRequestsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(housekeepingRequestService.getRequestsByStatus(status));
    }

    @GetMapping("/housekeeping-requests/room/{roomId}")
    public ResponseEntity<List<HousekeepingRequest>> getHousekeepingRequestsByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(housekeepingRequestService.getRequestsByRoom(roomId));
    }

    @PatchMapping("/housekeeping-requests/{id}/status")
    public ResponseEntity<HousekeepingRequest> updateHousekeepingRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(housekeepingRequestService.updateStatus(id, status));
    }
}
