package com.example.phuocloc.bookingmovieticket.request.Booking;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class BookingConfirmRequest {
    @NotEmpty
    private List<Long> showSeatIds;
}

