package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Theater.TheaterDTO;
import com.example.phuocloc.bookingmovieticket.request.Theater.TheaterCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Theater.TheaterUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Location.TheaterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
public class TheaterController {
  private final TheaterService theaterService;

  @GetMapping
  public ResponseEntity<List<TheaterDTO>> list(@RequestParam(required = false) Long provinceId) {
    return ResponseEntity.ok(theaterService.list(provinceId));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<TheaterDTO>> create(@RequestBody @Valid TheaterCreateDTO dto) {
    TheaterDTO created = theaterService.create(dto);
    ApiResponse<TheaterDTO> res = new ApiResponse<>(true, "Tạo rạp thành công!", created, HttpStatus.CREATED.value(), LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.CREATED).body(res);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<TheaterDTO>> update(@PathVariable Long id, @RequestBody @Valid TheaterUpdateDTO dto) {
    TheaterDTO updated = theaterService.update(id, dto);
    ApiResponse<TheaterDTO> res = new ApiResponse<>(true, "Cập nhật rạp thành công!", updated, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
    theaterService.delete(id);
    ApiResponse<Void> res = new ApiResponse<>(true, "Xoá rạp thành công!", null, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }
}

