package com.example.phuocloc.bookingmovieticket.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyRevenueDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private long bookingCount;
    private long ticketCount;
}
