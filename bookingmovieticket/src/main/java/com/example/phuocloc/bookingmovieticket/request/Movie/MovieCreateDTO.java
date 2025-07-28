package com.example.phuocloc.bookingmovieticket.request.Movie;

import java.time.LocalDate;
import java.util.Set;

import lombok.Data;

@Data
public class MovieCreateDTO {
    private String title;
    private int duration;
    private LocalDate releaseDate;
    private String imageUrl;
    private String trailerUrl;
    private String ageRating;
    private String language;
    private String description;
    private Set<Long> genreIds;
    private Set<Long> directorIds;
    private Set<Long> authorIds;
}
