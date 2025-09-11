package com.example.phuocloc.bookingmovieticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Author;


@Repository
public interface AuthorRespository extends JpaRepository<Author, Long> {
    

}
