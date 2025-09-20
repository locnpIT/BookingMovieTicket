package com.example.phuocloc.bookingmovieticket.repository;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.SeatHold;

@Repository
public interface SeatHoldRepository extends JpaRepository<SeatHold, Long> {
    List<SeatHold> findByShowSeat_IdIn(Collection<Long> showSeatIds);
    List<SeatHold> findByExpiresAtUtcBefore(OffsetDateTime now);
    Optional<SeatHold> findByShowSeat_IdAndUser_Id(Long showSeatId, Long userId);
}
