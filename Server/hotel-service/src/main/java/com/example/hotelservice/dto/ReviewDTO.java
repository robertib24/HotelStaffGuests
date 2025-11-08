package com.example.hotelservice.dto;

import com.example.hotelservice.entity.Review;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Long guestId;
    private String guestName;
    private Long roomId;
    private String roomNumber;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.guestId = review.getGuest().getId();
        this.guestName = review.getGuest().getName();
        this.roomId = review.getRoom().getId();
        this.roomNumber = review.getRoom().getNumber();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
    }
}