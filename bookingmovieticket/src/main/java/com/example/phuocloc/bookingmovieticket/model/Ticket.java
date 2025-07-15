package com.example.phuocloc.bookingmovieticket.model;

import com.example.phuocloc.bookingmovieticket.enums.TicketStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Ticket extends BaseEntity{

    @Column(unique = true, length = 50)
    @NotBlank(message = "Ticket code is required!")
    private String ticketCode;

    @Min(value = 0, message = "Price must be positive!")
    private Double price;

    @Column(length = 1000)
    private String qrCode;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.VALID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
    
}
