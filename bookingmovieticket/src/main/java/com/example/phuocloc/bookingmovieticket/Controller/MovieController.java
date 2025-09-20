package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.example.phuocloc.bookingmovieticket.dto.Movie.MovieDTO;
import com.example.phuocloc.bookingmovieticket.enums.MovieStatus;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Movie.MovieUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Movie.MovieService;

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
    public ResponseEntity<List<MovieDTO>> getAllMovies(
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String q) {
        List<MovieDTO> movies = movieService.getAllMovies(status, q);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<MovieDTO>> getMoviesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String q) {
        Page<MovieDTO> result = movieService.getMoviesPaged(status, page, size, q);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieDTO>> uploadMovieImage(
        @PathVariable Long id,
        @RequestPart(value = "file", required = true) MultipartFile file
    ){
        MovieDTO current = movieService.uploadMovieImage(id, file);
        ApiResponse<MovieDTO> response = new ApiResponse<>(
            true,
            "Đã nhận file. Ảnh đang được tải lên nền.",
            current,
            HttpStatus.ACCEPTED.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        ApiResponse<Void> response = new ApiResponse<>(
            true,
            "Xoá phim thành công!",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

}
