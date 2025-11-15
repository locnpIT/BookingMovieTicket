package com.example.phuocloc.bookingmovieticket.service.Booking;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
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

    @Transactional(timeout = 5)
    public BookingDTO confirm(User user, List<Long> showSeatIds, BigDecimal discountAmount) {
        if (showSeatIds == null || showSeatIds.isEmpty()) throw new OperationNotAllowedException("No seats selected");
        // Deduplicate ids to avoid double processing and unique conflicts
        showSeatIds = new ArrayList<>(new LinkedHashSet<>(showSeatIds));
        // Validate holds exist and not expired
        List<SeatHold> holds = seatHoldRepository.findByShowSeat_IdIn(showSeatIds);
        if (holds.size() != showSeatIds.size()) throw new OperationNotAllowedException("Some seats are not held");
        OffsetDateTime now = OffsetDateTime.now();
        for (SeatHold h : holds) {
            if (h.getExpiresAtUtc().isBefore(now)) throw new OperationNotAllowedException("Seat hold expired");
            if (!h.getUser().getId().equals(user.getId())) throw new OperationNotAllowedException("Seat held by another user");
        }

        // Lock target seats to prevent concurrent ticket creation
        List<ShowSeat> showSeats = showSeatRepository.lockByIds(showSeatIds);
        // Pre-check: ensure no tickets already exist for these seats
        long existingTickets = ticketRepository.countByShowSeat_IdIn(showSeatIds);
        if (existingTickets > 0) {
            throw new OperationNotAllowedException("Seat already sold");
        }

        // All seats must belong to the same showtime
        if (showSeats.isEmpty()) throw new OperationNotAllowedException("No seats selected");
        Long stId = showSeats.get(0).getShowtime().getId();
        boolean sameShowtime = showSeats.stream().allMatch(ss -> ss.getShowtime().getId().equals(stId));
        if (!sameShowtime) throw new OperationNotAllowedException("Seats are not in the same showtime");

        // Create booking
        Booking booking = new Booking();
        booking.setBookingCode(generateCode());
        booking.setUser(user);
        booking.setBookingTime(OffsetDateTime.now());
        booking.setTotalPrice(BigDecimal.ZERO);
        booking.setShowtime(showSeats.get(0).getShowtime());
        booking = bookingRepository.save(booking);

        BigDecimal total = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();
        for (ShowSeat ss : showSeats) {
            if (ss.getStatus() == ShowSeatStatus.SOLD) throw new OperationNotAllowedException("Seat already sold");
            ss.setStatus(ShowSeatStatus.SOLD);
            try {
                showSeatRepository.save(ss);
            } catch (ObjectOptimisticLockingFailureException ex) {
                throw new OperationNotAllowedException("Seat was taken by another user. Please choose another seat!", ex);
            }
            Ticket t = new Ticket();
            t.setBooking(booking);
            t.setShowSeat(ss);
            t.setPrice(ss.getEffectivePrice());
            t.setTicketCode(generateTicketCode());
            tickets.add(t);
            total = total.add(ss.getEffectivePrice());
        }
        try {
            ticketRepository.saveAll(tickets);
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            // Unique constraint on tickets(show_seat_id) violated -> seat already has a ticket
            throw new OperationNotAllowedException("Seat already sold", ex);
        }
        BigDecimal finalPrice = total;
        if (discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0) {
            finalPrice = total.subtract(discountAmount);
            if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
                finalPrice = BigDecimal.ZERO;
            }
        }
        
        booking.setTotalPrice(finalPrice);
        booking = bookingRepository.save(booking);
        seatHoldRepository.deleteAll(holds);

        BookingDTO dto = toDto(booking, tickets);
        dto.setDiscountAmount(discountAmount != null ? discountAmount : BigDecimal.ZERO);
        dto.setFinalPrice(finalPrice);
        return dto;
    }

    private String generateCode() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    private String generateTicketCode() {
        return "T-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> listBookings(User user) {
        return bookingRepository.findByUser_IdOrderByBookingTimeDesc(user.getId()).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private BookingDTO toDto(Booking booking) {
        return toDto(booking, null);
    }

    private BookingDTO toDto(Booking booking, List<Ticket> overrideTickets) {
        List<Ticket> tickets = overrideTickets != null ? overrideTickets : new ArrayList<>(booking.getTickets());
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
}
