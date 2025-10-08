package com.example.phuocloc.bookingmovieticket.Controller;

import com.example.phuocloc.bookingmovieticket.dto.User.UserDTO;
import com.example.phuocloc.bookingmovieticket.request.User.ChangePasswordRequest;
import com.example.phuocloc.bookingmovieticket.request.User.UserProfileUpdateRequest;
import com.example.phuocloc.bookingmovieticket.request.UserCreateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.User.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/oauth/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody UserCreateDTO dto) {
        UserDTO saved = userService.saveUser(dto);
        ApiResponse<UserDTO> response = new ApiResponse<>(
            true,
            "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác minh.",
            saved,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/oauth/verify")
    public ResponseEntity<ApiResponse<String>> verifyAccount(
            @RequestParam String email,
            @RequestParam String code) {

        boolean result = userService.verifyUser(email, code);

        if (result) {
            ApiResponse<String> response = new ApiResponse<>(
                    true, "Tài khoản đã được xác minh thành công!", null, 200, LocalDateTime.now());
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<String> response = new ApiResponse<>(
                    false, "Mã xác minh không đúng hoặc đã hết hạn!", null, 400, LocalDateTime.now());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/account/profile")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
        @Valid @RequestBody UserProfileUpdateRequest request,
        Authentication authentication
    ) {
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        UserDTO updated = userService.updateProfile(principal.getUser().getId(), request);

        ApiResponse<UserDTO> response = new ApiResponse<>(
            true,
            "Cập nhật thông tin thành công",
            updated,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/account/change-password")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<String>> changePassword(
        @Valid @RequestBody ChangePasswordRequest request,
        Authentication authentication
    ) {
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        userService.changePassword(principal.getUser().getId(), request);

        ApiResponse<String> response = new ApiResponse<>(
            true,
            "Đổi mật khẩu thành công",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

}
