package com.example.phuocloc.bookingmovieticket.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.phuocloc.bookingmovieticket.model.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByShowSeat_IdIn(Collection<Long> showSeatIds);
}
