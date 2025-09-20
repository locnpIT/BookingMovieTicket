package com.example.phuocloc.bookingmovieticket.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.report.RevenueSummaryDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.report.RevenueService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class AdminReportController {

    private final RevenueService revenueService;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RevenueSummaryDTO>> summary() {
        RevenueSummaryDTO data = revenueService.getSummary();
        ApiResponse<RevenueSummaryDTO> res = new ApiResponse<>(true, "Revenue summary", data, 200, java.time.LocalDateTime.now());
        return ResponseEntity.ok(res);
    }
}
