package com.example.phuocloc.bookingmovieticket.service.Booking;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.dto.Booking.BookingDTO;
import com.example.phuocloc.bookingmovieticket.enums.ShowSeatStatus;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.model.Booking;
import com.example.phuocloc.bookingmovieticket.model.SeatHold;
import com.example.phuocloc.bookingmovieticket.model.ShowSeat;
import com.example.phuocloc.bookingmovieticket.model.Ticket;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.BookingRepository;
import com.example.phuocloc.bookingmovieticket.repository.SeatHoldRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowSeatRepository;
import com.example.phuocloc.bookingmovieticket.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingFlowService {
    private final ShowSeatRepository showSeatRepository;
    private final SeatHoldRepository seatHoldRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public BookingDTO confirm(User user, List<Long> showSeatIds) {
        if (showSeatIds == null || showSeatIds.isEmpty()) throw new OperationNotAllowedException("No seats selected");
        // Validate holds exist and not expired
        List<SeatHold> holds = seatHoldRepository.findByShowSeat_IdIn(showSeatIds);
        if (holds.size() != showSeatIds.size()) throw new OperationNotAllowedException("Some seats are not held");
        OffsetDateTime now = OffsetDateTime.now();
        for (SeatHold h : holds) {
            if (h.getExpiresAtUtc().isBefore(now)) throw new OperationNotAllowedException("Seat hold expired");
            if (!h.getUser().getId().equals(user.getId())) throw new OperationNotAllowedException("Seat held by another user");
        }

        List<ShowSeat> showSeats = showSeatRepository.findByIdIn(showSeatIds);
        // Create booking
        Booking booking = new Booking();
        booking.setBookingCode(generateCode());
        booking.setUser(user);
        booking.setBookingTime(OffsetDateTime.now());
        booking.setTotalPrice(BigDecimal.ZERO);
        booking = bookingRepository.save(booking);

        BigDecimal total = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();
        for (ShowSeat ss : showSeats) {
            if (ss.getStatus() == ShowSeatStatus.SOLD) throw new OperationNotAllowedException("Seat already sold");
            ss.setStatus(ShowSeatStatus.SOLD);
            showSeatRepository.save(ss);
            Ticket t = new Ticket();
            t.setBooking(booking);
            t.setShowSeat(ss);
            t.setPrice(ss.getEffectivePrice());
            t.setTicketCode(generateTicketCode());
            tickets.add(t);
            total = total.add(ss.getEffectivePrice());
        }
        ticketRepository.saveAll(tickets);
        booking.setTotalPrice(total);
        booking = bookingRepository.save(booking);
        seatHoldRepository.deleteAll(holds);

        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setBookingCode(booking.getBookingCode());
        dto.setBookingTime(booking.getBookingTime());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setTickets(tickets.stream().map(t -> {
            BookingDTO.TicketDTO td = new BookingDTO.TicketDTO();
            td.setId(t.getId());
            td.setTicketCode(t.getTicketCode());
            td.setPrice(t.getPrice());
            td.setSeatNumber(t.getShowSeat().getSeat().getSeatNumber());
            return td;
        }).collect(Collectors.toList()));

        return dto;
    }

    private String generateCode() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    private String generateTicketCode() {
        return "T-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}

