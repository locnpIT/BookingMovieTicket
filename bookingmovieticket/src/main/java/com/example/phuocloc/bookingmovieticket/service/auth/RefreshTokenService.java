package com.example.phuocloc.bookingmovieticket.service.auth;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.model.RefreshToken;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpirationMinutes;

    public Duration getRefreshTokenTtl() {
        return Duration.ofMinutes(refreshTokenExpirationMinutes);
    }

    @Transactional
    public RefreshToken create(User user) {
        revokeActiveTokens(user);
        RefreshToken token = new RefreshToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(OffsetDateTime.now().plusMinutes(refreshTokenExpirationMinutes));
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    @Transactional(readOnly = true)
    public RefreshToken verify(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
            .orElseThrow(() -> new OperationNotAllowedException("Refresh token không hợp lệ"));
        if (token.isRevoked()) {
            throw new OperationNotAllowedException("Refresh token đã bị thu hồi");
        }
        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new OperationNotAllowedException("Refresh token đã hết hạn");
        }
        return token;
    }

    @Transactional
    public RefreshToken rotate(RefreshToken current) {
        current.setRevoked(true);
        refreshTokenRepository.save(current);
        return create(current.getUser());
    }

    @Transactional
    public void revoke(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    @Transactional
    public void revokeActiveTokens(User user) {
        refreshTokenRepository.findByUserAndRevokedFalse(user).forEach(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }
}
