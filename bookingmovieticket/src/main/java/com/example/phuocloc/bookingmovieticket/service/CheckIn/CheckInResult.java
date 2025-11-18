package com.example.phuocloc.bookingmovieticket.service.CheckIn;

/**
 * Result object for check-in operation
 */
public class CheckInResult {
    private final Long checkInId;
    private final int basePoints;
    private final int bonusPoints;
    private final int totalPoints;
    private final int consecutiveDays;
    private final boolean isMilestone;
    
    public CheckInResult(Long checkInId, int basePoints, int bonusPoints, int totalPoints, int consecutiveDays, boolean isMilestone) {
        this.checkInId = checkInId;
        this.basePoints = basePoints;
        this.bonusPoints = bonusPoints;
        this.totalPoints = totalPoints;
        this.consecutiveDays = consecutiveDays;
        this.isMilestone = isMilestone;
    }
    
    public Long getCheckInId() { 
        return checkInId; 
    }
    
    public int getBasePoints() { 
        return basePoints; 
    }
    
    public int getBonusPoints() { 
        return bonusPoints; 
    }
    
    public int getTotalPoints() { 
        return totalPoints; 
    }
    
    public int getConsecutiveDays() { 
        return consecutiveDays; 
    }
    
    public boolean isMilestone() { 
        return isMilestone; 
    }
}

