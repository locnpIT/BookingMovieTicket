package com.example.phuocloc.bookingmovieticket.dto.CheckIn;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckInStatusDTO {
    private boolean hasCheckedInToday;
    private int consecutiveDays;
    private int totalCheckIns;
    private int nextMilestone;
    private int daysUntilNextMilestone;
    private List<CheckInDayDTO> checkIns;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckInDayDTO {
        private LocalDate date;
        private int pointsEarned;
        private int bonusPoints;
        private int totalPoints;
    }
}

