package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;

import com.example.phuocloc.bookingmovieticket.enums.SeatStatus;
import com.example.phuocloc.bookingmovieticket.enums.SeatType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
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
@Table(name="seat", uniqueConstraints = {
  @UniqueConstraint(name="uk_seat_room_seatno", columnNames={"room_id","seat_number"})
}, indexes = @Index(name="idx_seat_room", columnList="room_id"))
@Getter
@Setter
@RequiredArgsConstructor
public class Seat extends BaseEntity{

    @Column(name = "seat_number", nullable = false, length = 10)
    @NotBlank(message = "SeatNumber is required!")
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    private SeatStatus status = SeatStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    private SeatType type;

    @Column(precision=6, scale=2, nullable=false)
    private BigDecimal priceMultiplier = BigDecimal.ONE;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;



    
}
