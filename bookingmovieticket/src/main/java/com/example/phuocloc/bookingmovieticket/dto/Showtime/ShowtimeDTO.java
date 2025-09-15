package com.example.phuocloc.bookingmovieticket.dto.Showtime;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.example.phuocloc.bookingmovieticket.enums.ShowtimeStatus;

import lombok.Data;

@Data
public class ShowtimeDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long roomId;
    private String roomNumber;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private BigDecimal basePrice;
    private ShowtimeStatus status;
}

