package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Showtime.ShowtimeDTO;
import com.example.phuocloc.bookingmovieticket.request.Showtime.ShowtimeCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Showtime.ShowtimeUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Showtime.ShowtimeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @GetMapping
    public ResponseEntity<List<ShowtimeDTO>> list(
        @RequestParam(required = false) Long movieId,
        @RequestParam(required = false) Long roomId,
        @RequestParam(required = false) LocalDate date,
        @RequestParam(required = false) String q
    ){
        List<ShowtimeDTO> items = showtimeService.listByFilters(movieId, roomId, date, q);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShowtimeDTO>> create(@RequestBody @Valid ShowtimeCreateDTO dto) {
        ShowtimeDTO created = showtimeService.create(dto);
        ApiResponse<ShowtimeDTO> response = new ApiResponse<>(true, "Tạo suất chiếu thành công!", created, HttpStatus.CREATED.value(), java.time.LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShowtimeDTO>> update(@PathVariable Long id, @RequestBody @Valid ShowtimeUpdateDTO dto) {
        ShowtimeDTO updated = showtimeService.update(id, dto);
        ApiResponse<ShowtimeDTO> response = new ApiResponse<>(true, "Cập nhật suất chiếu thành công!", updated, HttpStatus.OK.value(), java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        showtimeService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>(true, "Xoá suất chiếu thành công!", null, HttpStatus.OK.value(), java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
}
