package com.example.phuocloc.bookingmovieticket.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.DailyCheckIn;
import com.example.phuocloc.bookingmovieticket.model.User;

@Repository
public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    
    Optional<DailyCheckIn> findByUserAndCheckInDate(User user, LocalDate date);
    
    @Query("SELECT c FROM DailyCheckIn c WHERE c.user = :user AND c.monthYear = :monthYear ORDER BY c.checkInDate ASC")
    List<DailyCheckIn> findByUserAndMonthYearOrderByCheckInDateAsc(@Param("user") User user, @Param("monthYear") String monthYear);
    
    @Query("SELECT COUNT(c) FROM DailyCheckIn c WHERE c.user = :user AND c.monthYear = :monthYear")
    long countByUserAndMonthYear(@Param("user") User user, @Param("monthYear") String monthYear);
    
    @Query("SELECT c FROM DailyCheckIn c WHERE c.user = :user AND c.checkInDate >= :startDate AND c.checkInDate <= :endDate ORDER BY c.checkInDate ASC")
    List<DailyCheckIn> findByUserAndCheckInDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

