package com.example.phuocloc.bookingmovieticket.dto.Seat;

import java.math.BigDecimal;

import com.example.phuocloc.bookingmovieticket.enums.SeatStatus;
import com.example.phuocloc.bookingmovieticket.enums.SeatType;

import lombok.Data;

@Data
public class SeatDTO {
    private Long id;
    private String seatNumber;
    private SeatStatus status;
    private SeatType type;
    private BigDecimal priceMultiplier;
}

