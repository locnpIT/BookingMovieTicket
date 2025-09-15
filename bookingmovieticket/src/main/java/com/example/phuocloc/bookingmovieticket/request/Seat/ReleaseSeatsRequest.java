package com.example.phuocloc.bookingmovieticket.request.Seat;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ReleaseSeatsRequest {
    @NotEmpty
    private List<Long> showSeatIds;
}

