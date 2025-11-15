package com.example.hotelservice.repository;

import com.example.hotelservice.entity.RoomServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RoomServiceRequestRepository extends JpaRepository<RoomServiceRequest, Long> {
    List<RoomServiceRequest> findByGuestIdOrderByCreatedAtDesc(Long guestId);
    List<RoomServiceRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<RoomServiceRequest> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);

    @Query("SELECT COUNT(r) FROM RoomServiceRequest r WHERE r.status = :status AND r.createdAt >= :startDate")
    long countByStatusAndCreatedAtAfter(@Param("status") String status, @Param("startDate") LocalDateTime startDate);
}
