package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r.startDate, COUNT(r) FROM Reservation r WHERE r.startDate >= :startDate GROUP BY r.startDate ORDER BY r.startDate ASC")
    List<Object[]> getCheckInsPerDay(@Param("startDate") LocalDate startDate);

    @Query("SELECT r.createdAt, SUM(r.totalPrice) FROM Reservation r WHERE r.createdAt >= :startDate GROUP BY r.createdAt ORDER BY r.createdAt ASC")
    List<Object[]> getEarningsPerDay(@Param("startDate") LocalDate startDate);

    @Query("SELECT r.room.type, r.guest.name, r.guest.email FROM Reservation r ORDER BY r.room.type")
    List<Object[]> getGuestsPerRoomType();

    @Query("SELECT COUNT(r) FROM Reservation r " +
            "WHERE r.room.id = :roomId " +
            "AND r.startDate < :endDate AND r.endDate > :startDate " +
            "AND (:id IS NULL OR r.id != :id)")
    long countOverlappingReservations(@Param("roomId") Long roomId,
                                      @Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      @Param("id") Long id);
}