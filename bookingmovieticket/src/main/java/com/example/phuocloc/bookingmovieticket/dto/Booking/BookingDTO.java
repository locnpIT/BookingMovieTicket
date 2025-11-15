package com.example.phuocloc.bookingmovieticket.dto.Booking;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import lombok.Data;

@Data
public class BookingDTO {
    private Long id;
    private String bookingCode;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal finalPrice;
    private OffsetDateTime bookingTime;
    private List<TicketDTO> tickets;

    @Data
    public static class TicketDTO {
        private Long id;
        private String ticketCode;
        private String seatNumber;
        private BigDecimal price;
    }
}
