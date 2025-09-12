package com.example.phuocloc.bookingmovieticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Showtime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    long countByMovie_Id(Long movieId);
}

