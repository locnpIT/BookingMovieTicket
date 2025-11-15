package com.example.phuocloc.bookingmovieticket.dto.Game;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class GameResultDTO {
    private Long sessionId;
    private Integer score;
    private BigDecimal pointsEarned;
    private BigDecimal totalPoints;
    private String message;
}

