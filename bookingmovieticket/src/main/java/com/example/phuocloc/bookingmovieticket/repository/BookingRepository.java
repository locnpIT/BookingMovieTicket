package com.example.phuocloc.bookingmovieticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    long countByShowtime_Id(Long showtimeId);
}

