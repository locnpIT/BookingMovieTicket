package com.example.phuocloc.bookingmovieticket.security.auth;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.request.User.ForgotPasswordRequest;
import com.example.phuocloc.bookingmovieticket.request.User.ResetPasswordRequest;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.auth.PasswordResetService;

import org.springframework.util.StringUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordResetService passwordResetService;

    @Value("${app.security.jwt.refresh-token.cookie-name:refreshToken}")
    private String refreshTokenCookieName;

    @Value("${app.security.jwt.refresh-token.cookie-path:/}")
    private String refreshTokenCookiePath;

    @Value("${app.security.jwt.refresh-token.cookie-secure:false}")
    private boolean refreshTokenCookieSecure;

    @Value("${app.security.jwt.refresh-token.cookie-same-site:Lax}")
    private String refreshTokenCookieSameSite;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            AuthTokens tokens = tokenService.generateTokenPair(userDetails.getUser());
            AuthResponse response = new AuthResponse();
            response.setAccessToken(tokens.accessToken());

            ResponseCookie refreshCookie = buildRefreshTokenCookie(tokens.refreshToken());

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request) {
        String refreshToken = resolveRefreshToken(request);
        if (!StringUtils.hasText(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AuthTokens tokens = tokenService.refreshTokens(refreshToken);
        AuthResponse response = new AuthResponse();
        response.setAccessToken(tokens.accessToken());

        ResponseCookie refreshCookie = buildRefreshTokenCookie(tokens.refreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());

        ApiResponse<String> response = new ApiResponse<>(
            true,
            "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reset-password/validate")
    public ResponseEntity<ApiResponse<String>> validateResetToken(@RequestParam String token) {
        passwordResetService.validateToken(token);

        ApiResponse<String> response = new ApiResponse<>(
            true,
            "Token hợp lệ",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);

        ApiResponse<String> response = new ApiResponse<>(
            true,
            "Đổi mật khẩu thành công",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    private String resolveRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (refreshTokenCookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private ResponseCookie buildRefreshTokenCookie(String value) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie
            .from(refreshTokenCookieName, value)
            .httpOnly(true)
            .path(refreshTokenCookiePath)
            .maxAge(tokenService.getRefreshTokenTtl())
            .sameSite(refreshTokenCookieSameSite);

        if (refreshTokenCookieSecure) {
            builder = builder.secure(true);
        }

        return builder.build();
    }
}
