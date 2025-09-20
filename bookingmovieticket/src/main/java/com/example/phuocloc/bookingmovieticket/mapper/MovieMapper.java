package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.model.Director;
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
    @Mapping(target = "directorNames", source = "directors", qualifiedByName = "mapDirectorsToNames")
    @Mapping(target = "authorNames", source = "authors", qualifiedByName = "mapAuthorsToNames")
    MovieDTO toMovieDTO(Movie movie);

    @Named("mapGenresToNames")
    default Set<String> mapGenresToNames(Set<Genre> genres) {
        return genres == null
            ? Set.of()
            : genres.stream().map(Genre::getName).collect(Collectors.toCollection(java.util.LinkedHashSet::new));
    }

    @Named("mapDirectorsToNames")
    default Set<String> mapDirectorsToNames(Set<Director> directors) {
        return directors == null
            ? Set.of()
            : directors.stream().map(Director::getName).collect(Collectors.toCollection(java.util.LinkedHashSet::new));
    }

    @Named("mapAuthorsToNames")
    default Set<String> mapAuthorsToNames(Set<Author> authors) {
        return authors == null
            ? Set.of()
            : authors.stream().map(Author::getName).collect(Collectors.toCollection(java.util.LinkedHashSet::new));
    }
}
