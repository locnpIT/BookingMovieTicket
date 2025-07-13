package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.websocket.Decoder.Text;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Movie extends BaseEntity{


    @Column(length = 1000)
    private String title;

    private int duration;

    private LocalDate releaseDate;

    private String imageUrl;

    private String trailerUrl;

    private String ageRating;

    private String language;

    private Double avgRating;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name="movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Review> reviews = new HashSet<>();

    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY)
    private Set<Showtime> showtimes = new HashSet<>();
    

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "movie_directors",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "director_id")
    )
    private Set<Director> directors = new HashSet<>();

    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "movie_authors",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<Author> authors = new HashSet<>();






    
}
