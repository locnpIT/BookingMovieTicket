package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.phuocloc.bookingmovieticket.dto.CheckIn.CheckInResultDTO;
import com.example.phuocloc.bookingmovieticket.dto.CheckIn.CheckInStatusDTO;
import com.example.phuocloc.bookingmovieticket.model.DailyCheckIn;
import com.example.phuocloc.bookingmovieticket.service.CheckIn.CheckInResult;
import com.example.phuocloc.bookingmovieticket.service.CheckIn.CheckInStatus;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CheckInMapper {
    
    /**
     * Map CheckInResult to CheckInResultDTO
     */
    public CheckInResultDTO toResultDTO(CheckInResult result) {
        if (result == null) {
            return null;
        }
        
        return new CheckInResultDTO(
            result.getCheckInId(),
            result.getBasePoints(),
            result.getBonusPoints(),
            result.getTotalPoints(),
            result.getConsecutiveDays(),
            result.isMilestone()
        );
    }
    
    /**
     * Map CheckInStatus to CheckInStatusDTO
     */
    public CheckInStatusDTO toStatusDTO(CheckInStatus status) {
        if (status == null) {
            return null;
        }
        
        List<CheckInStatusDTO.CheckInDayDTO> checkInDays = status.getCheckIns().stream()
            .map(this::toCheckInDayDTO)
            .collect(Collectors.toList());
        
        return new CheckInStatusDTO(
            status.isHasCheckedInToday(),
            status.getConsecutiveDays(),
            status.getTotalCheckIns(),
            status.getNextMilestone(),
            status.getDaysUntilNextMilestone(),
            checkInDays
        );
    }
    
    /**
     * Map DailyCheckIn to CheckInDayDTO
     */
    private CheckInStatusDTO.CheckInDayDTO toCheckInDayDTO(DailyCheckIn checkIn) {
        if (checkIn == null) {
            return null;
        }
        
        return new CheckInStatusDTO.CheckInDayDTO(
            checkIn.getCheckInDate(),
            checkIn.getPointsEarned(),
            checkIn.getBonusPoints(),
            checkIn.getTotalPoints()
        );
    }
}

