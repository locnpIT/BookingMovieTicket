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

import com.example.phuocloc.bookingmovieticket.dto.Room.RoomDTO;
import com.example.phuocloc.bookingmovieticket.dto.Seat.SeatDTO;
import com.example.phuocloc.bookingmovieticket.request.Room.RoomCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Room.RoomUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Location.RoomService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
  private final RoomService roomService;

  @GetMapping
  public ResponseEntity<List<RoomDTO>> list(@RequestParam(required = false) Long theaterId) {
    return ResponseEntity.ok(roomService.list(theaterId));
  }

  @GetMapping("/{id}/seats")
  public ResponseEntity<List<SeatDTO>> listSeats(@PathVariable Long id) {
    return ResponseEntity.ok(roomService.listSeats(id));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<RoomDTO>> create(@RequestBody @Valid RoomCreateDTO dto) {
    RoomDTO created = roomService.create(dto);
    ApiResponse<RoomDTO> res = new ApiResponse<>(true, "Tạo phòng chiếu thành công!", created, HttpStatus.CREATED.value(), LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.CREATED).body(res);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<RoomDTO>> update(@PathVariable Long id, @RequestBody @Valid RoomUpdateDTO dto) {
    RoomDTO updated = roomService.update(id, dto);
    ApiResponse<RoomDTO> res = new ApiResponse<>(true, "Cập nhật phòng chiếu thành công!", updated, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
    roomService.delete(id);
    ApiResponse<Void> res = new ApiResponse<>(true, "Xoá phòng chiếu thành công!", null, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }
}
