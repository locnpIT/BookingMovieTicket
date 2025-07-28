package com.example.phuocloc.bookingmovieticket.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.MovieMapper;
import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.model.Genre;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.repository.AuthorRepository;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;
import com.example.phuocloc.bookingmovieticket.repository.GenreRepository;
import com.example.phuocloc.bookingmovieticket.repository.MovieRepository;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieUpdateDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final DirectorRepository directorRepository;
    private final AuthorRepository authorRepository;
    private final MovieMapper movieMapper;

    @CacheEvict(value = "moviesCache", allEntries = true)
    public MovieDTO createMovie(MovieCreateDTO dto) {
        Movie movie = movieMapper.toMovie(dto);

    
        movie.setGenres(new HashSet<>(genreRepository.findAllById(dto.getGenreIds())));
        movie.setDirectors(new HashSet<>(directorRepository.findAllById(dto.getDirectorIds())));
        movie.setAuthors(new HashSet<>(authorRepository.findAllById(dto.getAuthorIds())));

        Movie saved = movieRepository.save(movie);
        return movieMapper.toMovieDTO(saved);
    }

    @CacheEvict(value = "moviesCache", allEntries = true)
    public MovieDTO patchUpdateMovie(Long id, MovieUpdateDTO dto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        if (dto.getTitle() != null) movie.setTitle(dto.getTitle());
        if (dto.getDuration() != null) movie.setDuration(dto.getDuration());
        if (dto.getReleaseDate() != null) movie.setReleaseDate(dto.getReleaseDate());
        if (dto.getImageUrl() != null) movie.setImageUrl(dto.getImageUrl());
        if (dto.getTrailerUrl() != null) movie.setTrailerUrl(dto.getTrailerUrl());
        if (dto.getAgeRating() != null) movie.setAgeRating(dto.getAgeRating());
        if (dto.getLanguage() != null) movie.setLanguage(dto.getLanguage());
        if (dto.getDescription() != null) movie.setDescription(dto.getDescription());
        if (dto.getStatus() != null) movie.setStatus(dto.getStatus());

        if (dto.getGenreIds() != null) {
            Set<Genre> genres = new HashSet<>(genreRepository.findAllById(dto.getGenreIds()));
            if (genres.size() != dto.getGenreIds().size()) {
                throw new ResourceNotFoundException("Some genres not found!");
            }
            movie.setGenres(genres);
        }
        if (dto.getDirectorIds() != null) {
            Set<Director> directors = new HashSet<>(directorRepository.findAllById(dto.getDirectorIds()));
            if (directors.size() != dto.getDirectorIds().size()) {
                throw new ResourceNotFoundException("Some directors not found!");
            }
            movie.setDirectors(directors);
        }
        if (dto.getAuthorIds() != null) {
            Set<Author> authors = new HashSet<>(authorRepository.findAllById(dto.getAuthorIds()));
            if (authors.size() != dto.getAuthorIds().size()) {
                throw new ResourceNotFoundException("Some authors not found!");
            }
            movie.setAuthors(authors);
        }

        Movie updated = movieRepository.save(movie);
        return movieMapper.toMovieDTO(updated);
    }
    @Cacheable(value = "moviesCache", key = "#status ?: 'all'")
    public List<MovieDTO> getAllMovies(MovieStatus status) {
        Specification<Movie> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        List<Movie> movies = movieRepository.findAll(spec, Sort.by("releaseDate").descending());

        return movieMapper.toMovieDTOList(movies);
    }
}


