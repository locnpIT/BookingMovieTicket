package com.example.phuocloc.bookingmovieticket.request.Seat;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class HoldSeatsRequest {
    @NotEmpty
    private List<Long> seatIds; // seat ids (Seat.id)
    private Integer ttlSeconds; // optional, default 300s
}

