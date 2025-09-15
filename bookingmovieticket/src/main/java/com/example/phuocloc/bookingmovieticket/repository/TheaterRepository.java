package com.example.phuocloc.bookingmovieticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Theater;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {
    List<Theater> findByProvince_Id(Long provinceId);
}

