package com.example.phuocloc.bookingmovieticket.request.Game;

import com.example.phuocloc.bookingmovieticket.enums.GameType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitGameRequest {
    @NotNull(message = "Game type is required")
    private GameType gameType;
    
    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be non-negative")
    private Integer score;
    
    private String gameData; // JSON string for game-specific data
}

