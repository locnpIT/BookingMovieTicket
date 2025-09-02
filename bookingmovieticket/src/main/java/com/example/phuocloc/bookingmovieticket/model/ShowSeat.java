package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;

import com.example.phuocloc.bookingmovieticket.enums.ShowSeatStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "show_seat",
  uniqueConstraints = @UniqueConstraint(name="uk_showseat_showtime_seat", columnNames={"showtime_id","seat_id"}),
  indexes  = {
    @Index(name="idx_showseat_showtime", columnList="showtime_id"),
    @Index(name="idx_showseat_seat", columnList="seat_id")
})
public class ShowSeat extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShowSeatStatus status = ShowSeatStatus.AVAILABLE;

    @Column(precision=19, scale=2, nullable=false)
    private BigDecimal effectivePrice;

    @Version
    private Long version;

}
