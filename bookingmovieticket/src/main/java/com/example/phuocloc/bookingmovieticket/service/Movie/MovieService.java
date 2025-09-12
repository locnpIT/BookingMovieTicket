package com.example.phuocloc.bookingmovieticket.service.Movie;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.mapper.MovieMapper;
import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.model.Genre;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;
import com.example.phuocloc.bookingmovieticket.repository.GenreRepository;
import com.example.phuocloc.bookingmovieticket.repository.MovieRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowtimeRepository;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieUpdateDTO;
import com.example.phuocloc.bookingmovieticket.service.Cloudinary.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final DirectorRepository directorRepository;
    private final MovieMapper movieMapper;
    private final MovieImageAsyncService movieImageAsyncService;
    private final CloudinaryService cloudinaryService;
    private final ShowtimeRepository showtimeRepository;

    @CacheEvict(value = "moviesCache", allEntries = true)
    public MovieDTO createMovie(MovieCreateDTO dto) {
        Movie movie = movieMapper.toMovie(dto);

    
        movie.setGenres(new HashSet<>(genreRepository.findAllById(dto.getGenreIds())));
        movie.setDirectors(new HashSet<>(directorRepository.findAllById(dto.getDirectorIds())));

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
        // if (dto.getAuthorIds() != null) {

        //     if (authors.size() != dto.getAuthorIds().size()) {
        //         throw new ResourceNotFoundException("Some authors not found!");
        //     }
        //     movie.setAuthors(authors);
        // }

        Movie updated = movieRepository.save(movie);
        return movieMapper.toMovieDTO(updated);
    }

    public MovieDTO uploadMovieImage(Long id, MultipartFile file){
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                movieImageAsyncService.uploadAndUpdate(id, bytes);
            } catch (Exception ex) {
                throw new RuntimeException("Không đọc được file upload: " + ex.getMessage(), ex);
            }
        }

        return movieMapper.toMovieDTO(movie);
    }

    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return movieMapper.toMovieDTO(movie);
    }

    @CacheEvict(value = "moviesCache", allEntries = true)
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        long showCount = showtimeRepository.countByMovie_Id(id);
        if (showCount > 0) {
            throw new OperationNotAllowedException("Không thể xoá phim vì đã có suất chiếu");
        }
        try {
            if (movie.getImagePublicId() != null && !movie.getImagePublicId().isBlank()) {
                cloudinaryService.deleteImage(movie.getImagePublicId());
            }
        } catch (Exception ignore) {}
        movieRepository.delete(movie);
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

    public Page<MovieDTO> getMoviesPaged(MovieStatus status, int page, int size) {
        Specification<Movie> spec = Specification.where(null);
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        Page<Movie> p = movieRepository.findAll(spec, PageRequest.of(page, size, Sort.by("releaseDate").descending()));
        return p.map(movieMapper::toMovieDTO);
    }
}
