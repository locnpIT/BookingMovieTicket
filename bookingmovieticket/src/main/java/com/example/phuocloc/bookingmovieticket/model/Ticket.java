package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;

import com.example.phuocloc.bookingmovieticket.enums.TicketStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="tickets", uniqueConstraints = {
  @UniqueConstraint(name="uk_ticket_code", columnNames={"ticket_code"}),
  @UniqueConstraint(name="uk_ticket_showseat", columnNames={"show_seat_id"})
})
@Getter
@Setter
@RequiredArgsConstructor
public class Ticket extends BaseEntity{

    @Column(name = "ticket_code", unique = true, length = 50, nullable = false)
    @NotBlank(message = "Ticket code is required!")
    private String ticketCode;

    @Column(precision=19, scale=2, nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.VALID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "show_seat_id", nullable = false)
    private ShowSeat showSeat;
    
}
