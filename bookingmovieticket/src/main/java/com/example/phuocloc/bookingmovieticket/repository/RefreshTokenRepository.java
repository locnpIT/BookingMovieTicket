package com.example.phuocloc.bookingmovieticket.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.RefreshToken;
import com.example.phuocloc.bookingmovieticket.model.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findByUserAndRevokedFalse(User user);
    void deleteByUser(User user);
    long deleteByExpiresAtBefore(OffsetDateTime time);
}
