package com.example.hotelservice.repository;

import com.example.hotelservice.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByGuestIdOrderByCreatedAtDesc(Long guestId);
}
