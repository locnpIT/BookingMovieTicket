package com.example.phuocloc.bookingmovieticket.service.report;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.report.DailyRevenueDTO;
import com.example.phuocloc.bookingmovieticket.dto.report.MovieRevenueDTO;
import com.example.phuocloc.bookingmovieticket.dto.report.RevenueSummaryDTO;
import com.example.phuocloc.bookingmovieticket.repository.BookingRepository;
import com.example.phuocloc.bookingmovieticket.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevenueService {
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    public RevenueSummaryDTO getSummary() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime startDaily = now.minusDays(6).withHour(0).withMinute(0).withSecond(0).withNano(0);
        OffsetDateTime start30 = now.minusDays(30);

        BigDecimal totalRevenue = bookingRepository.sumTotalRevenue();
        BigDecimal revenueLast30 = bookingRepository.sumRevenueSince(start30);
        long totalBookings = bookingRepository.count();
        long totalTickets = ticketRepository.count();

        List<DailyRevenueDTO> daily = bookingRepository.findDailyRevenueSinceNative(startDaily).stream()
            .map(row -> new DailyRevenueDTO(
                ((Date) row[0]).toLocalDate(),
                (BigDecimal) row[1],
                ((Number) row[2]).longValue(),
                ((Number) row[3]).longValue()
            )).collect(Collectors.toList());

        List<MovieRevenueDTO> topMovies = bookingRepository.findTopMovieRevenueSinceNative(start30).stream()
            .map(row -> new MovieRevenueDTO(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (BigDecimal) row[2],
                ((Number) row[3]).longValue()
            )).collect(Collectors.toList());

        return new RevenueSummaryDTO(
            totalRevenue,
            revenueLast30,
            totalBookings,
            totalTickets,
            daily,
            topMovies
        );
    }
}
