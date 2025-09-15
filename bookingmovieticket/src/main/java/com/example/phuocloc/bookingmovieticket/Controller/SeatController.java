package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Seat.ShowSeatDTO;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.request.Seat.HoldSeatsRequest;
import com.example.phuocloc.bookingmovieticket.request.Seat.ReleaseSeatsRequest;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.Booking.SeatSelectionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/showtimes/{showtimeId}")
@RequiredArgsConstructor
public class SeatController {
    private final SeatSelectionService seatSelectionService;

    @GetMapping("/seats")
    public ResponseEntity<List<ShowSeatDTO>> list(@PathVariable Long showtimeId) {
        return ResponseEntity.ok(seatSelectionService.listSeats(showtimeId));
    }

    @PostMapping("/hold")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<List<ShowSeatDTO>>> hold(@PathVariable Long showtimeId, @Valid @RequestBody HoldSeatsRequest req, Authentication auth) {
        int ttl = req.getTtlSeconds() != null ? req.getTtlSeconds() : 300;
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        List<ShowSeatDTO> held = seatSelectionService.holdSeats(showtimeId, req.getSeatIds(), user, ttl);
        ApiResponse<List<ShowSeatDTO>> res = new ApiResponse<>(true, "Giữ ghế thành công", held, HttpStatus.OK.value(), LocalDateTime.now());
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/hold")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> release(@PathVariable Long showtimeId, @Valid @RequestBody ReleaseSeatsRequest req) {
        seatSelectionService.releaseSeats(req.getShowSeatIds());
        ApiResponse<Void> res = new ApiResponse<>(true, "Đã huỷ giữ ghế", null, HttpStatus.OK.value(), LocalDateTime.now());
        return ResponseEntity.ok(res);
    }
}

