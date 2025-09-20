package com.example.phuocloc.bookingmovieticket.dto.report;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueSummaryDTO {
    private BigDecimal totalRevenue;
    private BigDecimal revenueLast30Days;
    private long totalBookings;
    private long totalTickets;
    private List<DailyRevenueDTO> dailyRevenue;
    private List<MovieRevenueDTO> topMovies;
}
