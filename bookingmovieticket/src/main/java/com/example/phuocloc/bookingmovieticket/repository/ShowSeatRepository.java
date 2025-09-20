package com.example.phuocloc.bookingmovieticket.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.ShowSeat;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
    List<ShowSeat> findByShowtime_Id(Long showtimeId);
    ShowSeat findByShowtime_IdAndSeat_Id(Long showtimeId, Long seatId);
    List<ShowSeat> findByIdIn(Collection<Long> ids);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from ShowSeat s where s.id in :ids")
    List<ShowSeat> lockByIds(@Param("ids") Collection<Long> ids);
}
