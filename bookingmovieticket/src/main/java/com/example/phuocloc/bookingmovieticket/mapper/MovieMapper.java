package com.example.phuocloc.bookingmovieticket.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.MovieDTO;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.request.MovieCreateDTO;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring")
public interface MovieMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "directors", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "showtimes", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    Movie toMovie(MovieCreateDTO dto);

    @Mapping(target = "genreNames", expression = "java(movie.getGenres().stream().map(g -> g.getName()).collect(Collectors.toSet()))")
    MovieDTO toMovieDTO(Movie movie);
}