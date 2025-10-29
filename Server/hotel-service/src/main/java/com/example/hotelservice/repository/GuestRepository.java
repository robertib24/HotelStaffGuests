package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {

    @Query("SELECT g.room.type, g.name, g.email FROM Guest g WHERE g.room IS NOT NULL ORDER BY g.room.type")
    List<Object[]> getGuestsPerRoomType();
}