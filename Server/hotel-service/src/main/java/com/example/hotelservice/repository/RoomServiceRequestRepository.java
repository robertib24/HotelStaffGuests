package com.example.hotelservice.repository;

import com.example.hotelservice.entity.RoomServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomServiceRequestRepository extends JpaRepository<RoomServiceRequest, Long> {
    List<RoomServiceRequest> findByGuestIdOrderByCreatedAtDesc(Long guestId);
    List<RoomServiceRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<RoomServiceRequest> findAllByOrderByCreatedAtDesc();
}
