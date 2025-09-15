package com.example.phuocloc.bookingmovieticket.request.Showtime;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.example.phuocloc.bookingmovieticket.enums.ShowtimeStatus;

import lombok.Data;

@Data
public class ShowtimeUpdateDTO {
    private Long roomId; // optional change room
    private OffsetDateTime startTime; // optional change start
    private BigDecimal basePrice; // optional change price
    private ShowtimeStatus status; // optional change status
}

