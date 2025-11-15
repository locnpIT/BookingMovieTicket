package com.example.phuocloc.bookingmovieticket.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.GameSession;
import com.example.phuocloc.bookingmovieticket.model.User;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByUser_IdOrderByPlayedAtDesc(Long userId);
    
    @Query("SELECT COUNT(g) FROM GameSession g WHERE g.user = :user AND g.playedAt >= :startDate")
    long countByUserAndPlayedAtAfter(@Param("user") User user, @Param("startDate") OffsetDateTime startDate);
    
    @Query("SELECT COUNT(g) FROM GameSession g WHERE g.user = :user AND g.gameType = :gameType AND g.playedAt >= :startDate")
    long countByUserAndGameTypeAndPlayedAtAfter(@Param("user") User user, @Param("gameType") com.example.phuocloc.bookingmovieticket.enums.GameType gameType, @Param("startDate") OffsetDateTime startDate);
    
    @Query("SELECT COALESCE(SUM(g.pointsEarned), 0) FROM GameSession g WHERE g.user = :user AND g.playedAt >= :startDate")
    java.math.BigDecimal sumPointsByUserAndPlayedAtAfter(@Param("user") User user, @Param("startDate") OffsetDateTime startDate);
}

