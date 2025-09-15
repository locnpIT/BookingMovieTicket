package com.example.phuocloc.bookingmovieticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByTheater_Id(Long theaterId);
    long countByTheater_Id(Long theaterId);
}
