package com.example.phuocloc.bookingmovieticket.service.CheckIn;

/**
 * Internal calculation result for check-in points
 */
class CheckInCalculation {
    private final int consecutiveDays;
    private final int bonusPoints;
    private final int totalPoints;
    private final boolean isMilestone;
    
    CheckInCalculation(int consecutiveDays, int bonusPoints, int totalPoints, boolean isMilestone) {
        this.consecutiveDays = consecutiveDays;
        this.bonusPoints = bonusPoints;
        this.totalPoints = totalPoints;
        this.isMilestone = isMilestone;
    }
    
    int getConsecutiveDays() {
        return consecutiveDays;
    }
    
    int getBonusPoints() {
        return bonusPoints;
    }
    
    int getTotalPoints() {
        return totalPoints;
    }
    
    boolean isMilestone() {
        return isMilestone;
    }
}

