package com.example.hotelservice.controller;

import com.example.hotelservice.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/weekly-earnings")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyEarnings() {
        return ResponseEntity.ok(reportService.getWeeklyEarnings());
    }
}