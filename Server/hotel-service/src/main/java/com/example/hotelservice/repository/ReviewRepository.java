package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRoomIdOrderByCreatedAtDesc(Long roomId);

    List<Review> findByGuestIdOrderByCreatedAtDesc(Long guestId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room.id = :roomId")
    Double getAverageRatingForRoom(@Param("roomId") Long roomId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.room.id = :roomId")
    Long countReviewsForRoom(@Param("roomId") Long roomId);
}