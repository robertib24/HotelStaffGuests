package com.example.hotelservice.repository;

import com.example.hotelservice.entity.HousekeepingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HousekeepingRequestRepository extends JpaRepository<HousekeepingRequest, Long> {
    List<HousekeepingRequest> findByGuestIdOrderByCreatedAtDesc(Long guestId);
    List<HousekeepingRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<HousekeepingRequest> findByRoomIdOrderByCreatedAtDesc(Long roomId);
    List<HousekeepingRequest> findAllByOrderByCreatedAtDesc();
}
