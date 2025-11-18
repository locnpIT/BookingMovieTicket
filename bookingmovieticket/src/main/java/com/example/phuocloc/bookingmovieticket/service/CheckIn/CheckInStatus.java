package com.example.phuocloc.bookingmovieticket.service.CheckIn;

import java.util.List;
import com.example.phuocloc.bookingmovieticket.model.DailyCheckIn;

/**
 * Status object for check-in information
 */
public class CheckInStatus {
    private final boolean hasCheckedInToday;
    private final int consecutiveDays;
    private final int totalCheckIns;
    private final int nextMilestone;
    private final int daysUntilNextMilestone;
    private final List<DailyCheckIn> checkIns;
    
    public CheckInStatus(boolean hasCheckedInToday, int consecutiveDays, int totalCheckIns, 
                       int nextMilestone, int daysUntilNextMilestone, List<DailyCheckIn> checkIns) {
        this.hasCheckedInToday = hasCheckedInToday;
        this.consecutiveDays = consecutiveDays;
        this.totalCheckIns = totalCheckIns;
        this.nextMilestone = nextMilestone;
        this.daysUntilNextMilestone = daysUntilNextMilestone;
        this.checkIns = checkIns;
    }
    
    public boolean isHasCheckedInToday() { 
        return hasCheckedInToday; 
    }
    
    public int getConsecutiveDays() { 
        return consecutiveDays; 
    }
    
    public int getTotalCheckIns() { 
        return totalCheckIns; 
    }
    
    public int getNextMilestone() { 
        return nextMilestone; 
    }
    
    public int getDaysUntilNextMilestone() { 
        return daysUntilNextMilestone; 
    }
    
    public List<DailyCheckIn> getCheckIns() { 
        return checkIns; 
    }
}

