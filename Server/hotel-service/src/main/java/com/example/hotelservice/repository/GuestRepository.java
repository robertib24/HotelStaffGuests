package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {

    @Query("SELECT g.room.type, g.name, g.email FROM Guest g WHERE g.room IS NOT NULL ORDER BY g.room.type")
    List<Object[]> getGuestsPerRoomType();

    @Query("SELECT g.checkInDate, COUNT(g) FROM Guest g WHERE g.checkInDate >= :startDate GROUP BY g.checkInDate ORDER BY g.checkInDate ASC")
    List<Object[]> getGuestCountPerDay(@Param("startDate") LocalDate startDate);
}