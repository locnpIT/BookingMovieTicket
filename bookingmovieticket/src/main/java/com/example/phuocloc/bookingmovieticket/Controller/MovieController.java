package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.MovieService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieDTO>> createMovie(@RequestBody @Valid MovieCreateDTO dto) {
        
        MovieDTO movieDTO = movieService.createMovie(dto);

        ApiResponse<MovieDTO> response = new ApiResponse<>(
            true,
            "Tạo phim thành công!",
            movieDTO,
            HttpStatus.CREATED.value(),
            LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieDTO>> patchUpdateMovie(@PathVariable Long id, @RequestBody @Valid MovieUpdateDTO dto) {
        MovieDTO updatedMovie = movieService.patchUpdateMovie(id, dto);
        ApiResponse<MovieDTO> response = new ApiResponse<MovieDTO>(
            true, "Cập nhật phim thành công!", 
            updatedMovie, 
            HttpStatus.OK.value(), 
            LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getAllMovies(@RequestParam(required = false) MovieStatus status) {
        List<MovieDTO> movies = movieService.getAllMovies(status);
        return ResponseEntity.ok(movies);
    }

}

