package com.example.phuocloc.bookingmovieticket.security.auth;

import java.time.Duration;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.RefreshToken;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.security.jwt.JwtUtility;
import com.example.phuocloc.bookingmovieticket.service.auth.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtUtility jwtUtility;
    private final RefreshTokenService refreshTokenService;

    public AuthTokens generateTokenPair(User user) {
        String accessToken = jwtUtility.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.create(user);
        return new AuthTokens(accessToken, refreshToken.getToken());
    }

    public AuthTokens refreshTokens(String refreshTokenValue) {
        RefreshToken current = refreshTokenService.verify(refreshTokenValue);
        RefreshToken rotated = refreshTokenService.rotate(current);
        String newAccess = jwtUtility.generateAccessToken(rotated.getUser());
        return new AuthTokens(newAccess, rotated.getToken());
    }

    public Duration getRefreshTokenTtl() {
        return refreshTokenService.getRefreshTokenTtl();
    }
}
