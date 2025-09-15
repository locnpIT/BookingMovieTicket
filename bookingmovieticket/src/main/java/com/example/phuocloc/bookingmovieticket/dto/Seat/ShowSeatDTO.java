package com.example.phuocloc.bookingmovieticket.dto.Seat;

import java.math.BigDecimal;

import com.example.phuocloc.bookingmovieticket.enums.SeatType;
import com.example.phuocloc.bookingmovieticket.enums.ShowSeatStatus;

import lombok.Data;

@Data
public class ShowSeatDTO {
    private Long showSeatId;
    private Long seatId;
    private String seatNumber;
    private SeatType seatType;
    private ShowSeatStatus status;
    private BigDecimal effectivePrice;
}

