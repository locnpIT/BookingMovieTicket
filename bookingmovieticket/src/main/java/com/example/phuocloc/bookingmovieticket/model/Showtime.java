package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDateTime;

import com.example.phuocloc.bookingmovieticket.enums.ShowtimeStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Showtime extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "theater_id")
    private Theater theater;

    @Column(nullable = false)
    private LocalDateTime startTime;
    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private int availableSeats;

    @Enumerated(EnumType.STRING)
    private ShowtimeStatus status;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;



    
}
