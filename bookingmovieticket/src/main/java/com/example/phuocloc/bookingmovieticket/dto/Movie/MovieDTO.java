package com.example.phuocloc.bookingmovieticket.dto.Movie;

import java.time.LocalDate;
import java.util.Set;

import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;

import lombok.Data;

@Data
public class MovieDTO {
    private Long id;
    private String title;
    private String imageUrl;
    private String trailerUrl;
    private LocalDate releaseDate;
    private int duration;
    private Double avgRating;
    private String language;
    private String ageRating;
    private MovieStatus status;
    private Set<String> genreNames;

}
