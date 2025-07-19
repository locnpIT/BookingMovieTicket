package com.example.phuocloc.bookingmovieticket.service;

import java.util.HashSet;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.MovieDTO;
import com.example.phuocloc.bookingmovieticket.mapper.MovieMapper;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.repository.AuthorRepository;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;
import com.example.phuocloc.bookingmovieticket.repository.GenreRepository;
import com.example.phuocloc.bookingmovieticket.repository.MovieRepository;
import com.example.phuocloc.bookingmovieticket.request.MovieCreateDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final DirectorRepository directorRepository;
    private final AuthorRepository authorRepository;
    private final MovieMapper movieMapper;

    public MovieDTO createMovie(MovieCreateDTO dto) {
        Movie movie = movieMapper.toMovie(dto);

        // Gán genre, director, author từ id
        movie.setGenres(new HashSet<>(genreRepository.findAllById(dto.getGenreIds())));
        movie.setDirectors(new HashSet<>(directorRepository.findAllById(dto.getDirectorIds())));
        movie.setAuthors(new HashSet<>(authorRepository.findAllById(dto.getAuthorIds())));

        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieDTO(saved);
    }
}


