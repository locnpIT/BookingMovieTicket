package com.example.phuocloc.bookingmovieticket.dto.report;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MovieRevenueDTO {
    private Long movieId;
    private String movieTitle;
    private BigDecimal revenue;
    private long bookingCount;
}
