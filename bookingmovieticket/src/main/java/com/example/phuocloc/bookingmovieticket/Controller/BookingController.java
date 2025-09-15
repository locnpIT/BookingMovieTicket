package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Booking.BookingDTO;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.request.Booking.BookingConfirmRequest;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.Booking.BookingFlowService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingFlowService bookingFlowService;

    @PostMapping("/confirm")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingDTO>> confirm(@Valid @RequestBody BookingConfirmRequest request, Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        BookingDTO dto = bookingFlowService.confirm(user, request.getShowSeatIds());
        ApiResponse<BookingDTO> res = new ApiResponse<>(true, "Đặt vé thành công!", dto, HttpStatus.CREATED.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}

