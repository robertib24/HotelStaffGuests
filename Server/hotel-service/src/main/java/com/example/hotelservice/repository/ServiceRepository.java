package com.example.hotelservice.repository;

import com.example.hotelservice.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}