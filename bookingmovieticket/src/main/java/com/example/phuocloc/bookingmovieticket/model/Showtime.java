package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDateTime;

import com.example.phuocloc.bookingmovieticket.enums.ShowtimeStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="showtime", uniqueConstraints = {
  @UniqueConstraint(name="uk_showtime_movie_room_start", columnNames={"movie_id","room_id","start_time"})
}, indexes = {
  @Index(name="idx_showtime_room_start", columnList="room_id,start_time"),
  @Index(name="idx_showtime_movie", columnList="movie_id")
})
@Getter
@Setter
@RequiredArgsConstructor
public class Showtime extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "room_id", nullable=false)
    private Room room;

    @Column(name = "start_time", nullable = false) 
    @NotNull
    private java.time.OffsetDateTime startTime;

    @Column(nullable = false) 
    @NotNull
    private java.time.OffsetDateTime endTime;

    @Column(precision=19, scale=2, nullable=false)
    private java.math.BigDecimal basePrice;

    @Enumerated(EnumType.STRING)
    private ShowtimeStatus status;


    
}
