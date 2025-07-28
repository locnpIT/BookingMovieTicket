package com.example.phuocloc.bookingmovieticket.request.Movie;

import java.time.LocalDate;
import java.util.Set;

import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;

import lombok.Data;

@Data
public class MovieUpdateDTO {
    private String title;
    private Integer duration;
    private LocalDate releaseDate;
    private String imageUrl;
    private String trailerUrl;
    private String ageRating;
    private String language;
    private String description;
    private Set<Long> genreIds;
    private Set<Long> directorIds;
    private Set<Long> authorIds;
    private MovieStatus status;
}