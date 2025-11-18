package com.example.phuocloc.bookingmovieticket.dto.CheckIn;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckInResultDTO {
    private Long checkInId;
    private int basePoints;
    private int bonusPoints;
    private int totalPoints;
    private int consecutiveDays;
    private boolean isMilestone;
}

