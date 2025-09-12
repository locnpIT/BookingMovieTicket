package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.model.Genre;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieCreateDTO;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "directors", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "showtimes", ignore = true)
    @Mapping(target = "banners", ignore = true)
    @Mapping(target = "avgRating", expression = "java(0.0)")
    @Mapping(target = "status", expression = "java(com.example.phuocloc.bookingmovieticket.enums.MovieStatus.UPCOMING)")
    @Mapping(target = "imagePublicId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Movie toMovie(MovieCreateDTO dto);

    List<MovieDTO> toMovieDTOList(List<Movie> movies);

    @Mapping(target = "genreNames", source = "genres", qualifiedByName = "mapGenresToNames")
    MovieDTO toMovieDTO(Movie movie);

    @Named("mapGenresToNames")
    default Set<String> mapGenresToNames(Set<Genre> genres) {
        if (genres == null) {
            return new HashSet<>();
        }
        return genres.stream().map(Genre::getName).collect(Collectors.toSet());
    }
}
