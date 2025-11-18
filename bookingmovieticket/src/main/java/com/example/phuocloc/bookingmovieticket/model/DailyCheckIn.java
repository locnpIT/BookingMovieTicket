package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Index;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "daily_check_in",
    uniqueConstraints = @UniqueConstraint(name = "uk_checkin_user_date", columnNames = {"user_id", "check_in_date"}),
    indexes = {
        @Index(name = "idx_checkin_user_date", columnList = "user_id,check_in_date"),
        @Index(name = "idx_checkin_date", columnList = "check_in_date")
    })
@Getter
@Setter
@RequiredArgsConstructor
public class DailyCheckIn extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;
    
    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned = 10; // Base points per day
    
    @Column(name = "bonus_points", nullable = false)
    private Integer bonusPoints = 0; // Bonus points for milestones
    
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 10; // Total points (earned + bonus)
    
    @Column(name = "checked_in_at", nullable = false)
    private OffsetDateTime checkedInAt = OffsetDateTime.now();
    
    @Column(name = "month_year", length = 7, nullable = false)
    private String monthYear; // Format: "YYYY-MM" for easy querying
}

