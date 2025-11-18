package com.example.phuocloc.bookingmovieticket.service.CheckIn;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.model.DailyCheckIn;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.model.UserPoints;
import com.example.phuocloc.bookingmovieticket.repository.DailyCheckInRepository;
import com.example.phuocloc.bookingmovieticket.repository.UserPointsRepository;
import com.example.phuocloc.bookingmovieticket.service.Game.GameService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for handling daily check-in functionality.
 * Manages check-in records, consecutive day tracking, and milestone rewards.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CheckInService {
    
    private final DailyCheckInRepository checkInRepository;
    private final UserPointsRepository userPointsRepository;
    private final GameService gameService;
    
    // Constants for check-in points and milestones
    private static final int BASE_POINTS = 10;
    private static final int MILESTONE_7_DAYS = 7;
    private static final int MILESTONE_14_DAYS = 14;
    private static final int MILESTONE_28_DAYS = 28;
    private static final int BONUS_7_DAYS = 20;
    private static final int BONUS_14_DAYS = 30;
    private static final int BONUS_28_DAYS = 100;
    
    private static final DateTimeFormatter MONTH_YEAR_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    
    /**
     * Check if user has already checked in today
     * 
     * @param user the user to check
     * @return true if user has checked in today, false otherwise
     * @throws IllegalArgumentException if user is null
     */
    public boolean hasCheckedInToday(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        LocalDate today = LocalDate.now();
        return checkInRepository.findByUserAndCheckInDate(user, today).isPresent();
    }
    
    /**
     * Get current month-year string in format "YYYY-MM"
     * 
     * @return month-year string (e.g., "2024-01")
     */
    private String getCurrentMonthYear() {
        return LocalDate.now().format(MONTH_YEAR_FORMATTER);
    }
    
    /**
     * Get consecutive check-in days in current month.
     * 
     * Algorithm:
     * 1. Get all check-ins for the month
     * 2. Find the most recent check-in date (today or before)
     * 3. Count backwards until finding a gap or reaching month start
     * 
     * @param user the user to check
     * @param monthYear the month in format "YYYY-MM"
     * @return number of consecutive days (0 if no check-ins or gap found)
     */
    private int getConsecutiveDaysInMonth(User user, String monthYear) {
        List<DailyCheckIn> checkIns = getCheckInsForMonth(user, monthYear);
        if (checkIns.isEmpty()) {
            return 0;
        }
        
        Set<LocalDate> checkInDates = extractCheckInDates(checkIns);
        LocalDate startDate = findStartDateForCounting(checkInDates);
        if (startDate == null) {
            return 0;
        }
        
        return countConsecutiveDaysBackwards(startDate, checkInDates);
    }
    
    /**
     * Get all check-ins for a user in a specific month
     */
    private List<DailyCheckIn> getCheckInsForMonth(User user, String monthYear) {
        return checkInRepository.findByUserAndMonthYearOrderByCheckInDateAsc(user, monthYear);
    }
    
    /**
     * Extract check-in dates from DailyCheckIn entities into a Set for O(1) lookup
     */
    private Set<LocalDate> extractCheckInDates(List<DailyCheckIn> checkIns) {
        return checkIns.stream()
            .map(DailyCheckIn::getCheckInDate)
            .collect(Collectors.toSet());
    }
    
    /**
     * Find the start date for counting consecutive days.
     * Returns today if checked in, otherwise the most recent check-in date before today.
     */
    private LocalDate findStartDateForCounting(Set<LocalDate> checkInDates) {
        LocalDate today = LocalDate.now();
        if (checkInDates.contains(today)) {
            return today;
        }
        return findMostRecentCheckInBeforeToday(checkInDates);
    }
    
    /**
     * Find the most recent check-in date that is not after today
     */
    private LocalDate findMostRecentCheckInBeforeToday(Set<LocalDate> checkInDates) {
        LocalDate today = LocalDate.now();
        return checkInDates.stream()
            .filter(date -> !date.isAfter(today))
            .max(LocalDate::compareTo)
            .orElse(null);
    }
    
    /**
     * Count consecutive days backwards from startDate until hitting a gap or month start
     */
    private int countConsecutiveDaysBackwards(LocalDate startDate, Set<LocalDate> checkInDates) {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        int consecutiveDays = 0;
        LocalDate currentDate = startDate;
        
        while (!currentDate.isBefore(firstDayOfMonth)) {
            if (checkInDates.contains(currentDate)) {
                consecutiveDays++;
                currentDate = currentDate.minusDays(1);
            } else {
                // Found a gap, stop counting
                break;
            }
        }
        
        return consecutiveDays;
    }
    
    /**
     * Calculate bonus points based on consecutive days.
     * Returns the highest applicable bonus (28 > 14 > 7 days).
     * 
     * @param consecutiveDays number of consecutive days
     * @return bonus points (0, 20, 30, or 100)
     */
    private int calculateBonusPoints(int consecutiveDays) {
        if (consecutiveDays >= MILESTONE_28_DAYS) {
            return BONUS_28_DAYS;
        } else if (consecutiveDays >= MILESTONE_14_DAYS) {
            return BONUS_14_DAYS;
        } else if (consecutiveDays >= MILESTONE_7_DAYS) {
            return BONUS_7_DAYS;
        }
        return 0;
    }
    
    /**
     * Check if this is a milestone day (exactly 7, 14, or 28 days).
     * Bonus is only awarded on the exact milestone day, not on subsequent days.
     * 
     * @param consecutiveDays number of consecutive days
     * @return true if this is exactly a milestone day
     */
    private boolean isMilestoneDay(int consecutiveDays) {
        return consecutiveDays == MILESTONE_7_DAYS 
            || consecutiveDays == MILESTONE_14_DAYS 
            || consecutiveDays == MILESTONE_28_DAYS;
    }
    
    /**
     * Perform daily check-in for a user.
     * 
     * Process:
     * 1. Validate user hasn't checked in today
     * 2. Calculate consecutive days and bonus points
     * 3. Create check-in record
     * 4. Update user's total points
     * 
     * @param user the user performing check-in
     * @return CheckInResult with check-in details
     * @throws IllegalArgumentException if user is null
     * @throws IllegalStateException if user has already checked in today
     */
    @Transactional
    public CheckInResult checkIn(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        log.info("Processing check-in for user: {}", user.getId());
        
        validateCheckIn(user);
        CheckInCalculation calculation = calculateCheckInPoints(user);
        DailyCheckIn checkIn = createCheckInRecord(user, calculation);
        updateUserPoints(user, calculation.getTotalPoints());
        
        log.info("Check-in successful for user: {}, consecutive days: {}, total points: {}", 
            user.getId(), calculation.getConsecutiveDays(), calculation.getTotalPoints());
        
        return buildCheckInResult(checkIn, calculation);
    }
    
    /**
     * Validate that user hasn't already checked in today
     */
    private void validateCheckIn(User user) {
        if (hasCheckedInToday(user)) {
            log.warn("User {} attempted duplicate check-in", user.getId());
            throw new IllegalStateException("Bạn đã điểm danh hôm nay rồi!");
        }
    }
    
    /**
     * Calculate check-in points including base points and milestone bonuses
     */
    private CheckInCalculation calculateCheckInPoints(User user) {
        String monthYear = getCurrentMonthYear();
        int consecutiveDays = getConsecutiveDaysInMonth(user, monthYear);
        int newConsecutiveDays = consecutiveDays + 1; // After today's check-in
        
        int bonusPoints = 0;
        boolean isMilestone = isMilestoneDay(newConsecutiveDays);
        if (isMilestone) {
            bonusPoints = calculateBonusPoints(newConsecutiveDays);
            log.info("Milestone reached for user: {} - {} consecutive days, bonus: {} points", 
                user.getId(), newConsecutiveDays, bonusPoints);
        }
        
        int totalPoints = BASE_POINTS + bonusPoints;
        
        return new CheckInCalculation(newConsecutiveDays, bonusPoints, totalPoints, isMilestone);
    }
    
    /**
     * Create and save check-in record
     */
    private DailyCheckIn createCheckInRecord(User user, CheckInCalculation calculation) {
        LocalDate today = LocalDate.now();
        String monthYear = getCurrentMonthYear();
        
        DailyCheckIn checkIn = new DailyCheckIn();
        checkIn.setUser(user);
        checkIn.setCheckInDate(today);
        checkIn.setPointsEarned(BASE_POINTS);
        checkIn.setBonusPoints(calculation.getBonusPoints());
        checkIn.setTotalPoints(calculation.getTotalPoints());
        checkIn.setCheckedInAt(OffsetDateTime.now());
        checkIn.setMonthYear(monthYear);
        
        return checkInRepository.save(checkIn);
    }
    
    /**
     * Update user's total points
     */
    private void updateUserPoints(User user, int points) {
        UserPoints userPoints = gameService.getOrCreateUserPoints(user);
        userPoints.addPoints(BigDecimal.valueOf(points));
        userPointsRepository.save(userPoints);
    }
    
    /**
     * Build CheckInResult from check-in record and calculation
     */
    private CheckInResult buildCheckInResult(DailyCheckIn checkIn, CheckInCalculation calculation) {
        return new CheckInResult(
            checkIn.getId(),
            BASE_POINTS,
            calculation.getBonusPoints(),
            calculation.getTotalPoints(),
            calculation.getConsecutiveDays(),
            calculation.isMilestone()
        );
    }
    
    /**
     * Get check-in status for current month.
     * 
     * @param user the user to get status for
     * @return CheckInStatus with current month's check-in information
     * @throws IllegalArgumentException if user is null
     */
    public CheckInStatus getCheckInStatus(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        
        String monthYear = getCurrentMonthYear();
        boolean hasCheckedInToday = hasCheckedInToday(user);
        List<DailyCheckIn> checkIns = getCheckInsForMonth(user, monthYear);
        int consecutiveDays = getConsecutiveDaysInMonth(user, monthYear);
        int totalCheckIns = checkIns.size();
        
        int nextMilestone = getNextMilestone(consecutiveDays);
        int daysUntilNextMilestone = nextMilestone > 0 ? nextMilestone - consecutiveDays : 0;
        
        return new CheckInStatus(
            hasCheckedInToday,
            consecutiveDays,
            totalCheckIns,
            nextMilestone,
            daysUntilNextMilestone,
            checkIns
        );
    }
    
    /**
     * Get next milestone based on current consecutive days.
     * 
     * @param currentDays current number of consecutive days
     * @return next milestone (7, 14, 28) or 0 if all milestones reached
     */
    private int getNextMilestone(int currentDays) {
        if (currentDays < MILESTONE_7_DAYS) {
            return MILESTONE_7_DAYS;
        } else if (currentDays < MILESTONE_14_DAYS) {
            return MILESTONE_14_DAYS;
        } else if (currentDays < MILESTONE_28_DAYS) {
            return MILESTONE_28_DAYS;
        }
        return 0; // All milestones reached
    }
}
