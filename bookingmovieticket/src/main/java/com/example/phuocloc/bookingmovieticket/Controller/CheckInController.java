package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.CheckIn.CheckInResultDTO;
import com.example.phuocloc.bookingmovieticket.dto.CheckIn.CheckInStatusDTO;
import com.example.phuocloc.bookingmovieticket.mapper.CheckInMapper;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.CheckIn.CheckInService;
import com.example.phuocloc.bookingmovieticket.service.CheckIn.CheckInResult;
import com.example.phuocloc.bookingmovieticket.service.CheckIn.CheckInStatus;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/check-in")
@RequiredArgsConstructor
public class CheckInController {
    
    private final CheckInService checkInService;
    private final CheckInMapper checkInMapper;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<CheckInResultDTO>> checkIn(Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        
        try {
            CheckInResult result = checkInService.checkIn(user);
            CheckInResultDTO dto = checkInMapper.toResultDTO(result);
            
            String message = result.isMilestone() 
                ? String.format("Điểm danh thành công! Nhận %d điểm + %d điểm thưởng = %d điểm!", 
                    result.getBasePoints(), result.getBonusPoints(), result.getTotalPoints())
                : String.format("Điểm danh thành công! Nhận %d điểm!", result.getTotalPoints());
            
            return ResponseEntity.ok(new ApiResponse<>(
                true,
                message,
                dto,
                HttpStatus.OK.value(),
                LocalDateTime.now()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                false,
                e.getMessage(),
                null,
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now()
            ));
        }
    }
    
    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<CheckInStatusDTO>> getStatus(Authentication auth) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        
        CheckInStatus status = checkInService.getCheckInStatus(user);
        CheckInStatusDTO dto = checkInMapper.toStatusDTO(status);
        
        return ResponseEntity.ok(new ApiResponse<>(
            true,
            "Lấy trạng thái điểm danh thành công",
            dto,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        ));
    }
}

