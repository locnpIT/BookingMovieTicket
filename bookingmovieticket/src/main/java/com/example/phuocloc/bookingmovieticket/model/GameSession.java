package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import com.example.phuocloc.bookingmovieticket.enums.GameType;

@Entity
@Table(name = "game_session")
@Getter
@Setter
@RequiredArgsConstructor
public class GameSession extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GameType gameType;
    
    @Column(nullable = false)
    private Integer score = 0;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal pointsEarned = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private OffsetDateTime playedAt = OffsetDateTime.now();
    
    @Column(columnDefinition = "TEXT")
    private String gameData; // JSON data for game-specific info
}

