package com.example.hotelservice.service;

import com.example.hotelservice.dto.ReviewDTO;
import com.example.hotelservice.dto.ReviewRequestDTO;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Review;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReviewRepository;
import com.example.hotelservice.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         GuestRepository guestRepository,
                         RoomRepository roomRepository) {
        this.reviewRepository = reviewRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public ReviewDTO createReview(ReviewRequestDTO request, String guestEmail) {
        Guest guest = guestRepository.findByEmail(guestEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele nu a fost găsit."));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Camera cu id " + request.getRoomId() + " nu a fost găsită."));

        Review review = Review.builder()
                .guest(guest)
                .room(room)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        return new ReviewDTO(savedReview);
    }

    public List<ReviewDTO> getReviewsByRoom(Long roomId) {
        return reviewRepository.findByRoomIdOrderByCreatedAtDesc(roomId).stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByGuest(String guestEmail) {
        Guest guest = guestRepository.findByEmail(guestEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Oaspetele nu a fost găsit."));

        return reviewRepository.findByGuestIdOrderByCreatedAtDesc(guest.getId()).stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getRoomRatingStats(Long roomId) {
        Double averageRating = reviewRepository.getAverageRatingForRoom(roomId);
        Long totalReviews = reviewRepository.countReviewsForRoom(roomId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
        stats.put("totalReviews", totalReviews);

        return stats;
    }

    @Transactional
    public void deleteReview(Long id, String guestEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review-ul cu id " + id + " nu a fost găsit."));

        if (!review.getGuest().getEmail().equals(guestEmail)) {
            throw new ResourceNotFoundException("Nu aveți permisiunea să ștergeți acest review.");
        }

        reviewRepository.delete(review);
    }
}