package com.example.phuocloc.bookingmovieticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    
    
}
