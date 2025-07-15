package com.example.phuocloc.bookingmovieticket.model;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Review extends BaseEntity{
    
    @Column(nullable = false)
    @Min(0)
    @Max(10)
    private int rating;

    @ColumnDefault("")
    private String comment;

    @ColumnDefault("false")
    private boolean approved; // duyet comment truoc khi public comment do len

    @ColumnDefault("false")
    private boolean spoiler;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;


}
