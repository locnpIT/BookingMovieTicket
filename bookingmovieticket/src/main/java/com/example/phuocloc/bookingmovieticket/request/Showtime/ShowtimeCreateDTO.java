package com.example.phuocloc.bookingmovieticket.request.Showtime;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShowtimeCreateDTO {
    @NotNull
    private Long movieId;
    @NotNull
    private Long roomId;
    @NotNull
    private OffsetDateTime startTime;
    @NotNull
    @Min(0)
    private BigDecimal basePrice;
}

