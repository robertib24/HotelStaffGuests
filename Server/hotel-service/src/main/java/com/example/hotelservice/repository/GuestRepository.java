package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}