package com.example.hotelservice.controller;

import com.example.hotelservice.dto.ReviewDTO;
import com.example.hotelservice.dto.ReviewRequestDTO;
import com.example.hotelservice.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/client/reviews")
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO request,
            Principal principal) {
        ReviewDTO review = reviewService.createReview(request, principal.getName());
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/reviews/room/{roomId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(reviewService.getReviewsByRoom(roomId));
    }

    @GetMapping("/client/my-reviews")
    public ResponseEntity<List<ReviewDTO>> getMyReviews(Principal principal) {
        return ResponseEntity.ok(reviewService.getReviewsByGuest(principal.getName()));
    }

    @GetMapping("/reviews/room/{roomId}/stats")
    public ResponseEntity<Map<String, Object>> getRoomRatingStats(@PathVariable Long roomId) {
        return ResponseEntity.ok(reviewService.getRoomRatingStats(roomId));
    }

    @DeleteMapping("/client/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, Principal principal) {
        reviewService.deleteReview(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}