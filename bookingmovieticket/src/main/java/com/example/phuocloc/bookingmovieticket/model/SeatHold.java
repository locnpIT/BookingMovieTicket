package com.example.phuocloc.bookingmovieticket.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter 
@RequiredArgsConstructor
@Table(name = "seat_hold", indexes = {
  @Index(name="idx_hold_showseat_expires", columnList="show_seat_id,expires_at_utc")
})
public class SeatHold extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="show_seat_id", nullable=false)
    private ShowSeat showSeat;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(name = "created_at_utc", nullable=false)
    private OffsetDateTime createdAtUtc;

    @Column(name = "expires_at_utc", nullable=false)
    private OffsetDateTime expiresAtUtc;

    @Version
    private Long version;


    
}
