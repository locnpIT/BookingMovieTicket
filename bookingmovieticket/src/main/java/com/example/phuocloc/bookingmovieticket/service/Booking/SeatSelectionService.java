package com.example.phuocloc.bookingmovieticket.service.Booking;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.dto.Seat.ShowSeatDTO;
import com.example.phuocloc.bookingmovieticket.enums.ShowSeatStatus;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.ShowSeatMapper;
import com.example.phuocloc.bookingmovieticket.model.Seat;
import com.example.phuocloc.bookingmovieticket.model.SeatHold;
import com.example.phuocloc.bookingmovieticket.model.ShowSeat;
import com.example.phuocloc.bookingmovieticket.model.Showtime;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.SeatHoldRepository;
import com.example.phuocloc.bookingmovieticket.repository.SeatRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowSeatRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatSelectionService {
    private final ShowtimeRepository showtimeRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SeatRepository seatRepository;
    private final SeatHoldRepository seatHoldRepository;
    private final ShowSeatMapper showSeatMapper;

    @Transactional
    public List<ShowSeatDTO> listSeats(Long showtimeId) {
        Showtime st = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + showtimeId));
        // Ensure show seats are generated for all seats in the room
        List<ShowSeat> existing = showSeatRepository.findByShowtime_Id(showtimeId);
        if (existing.isEmpty()) {
            List<Seat> seats = seatRepository.findByRoom_Id(st.getRoom().getId());
            List<ShowSeat> toCreate = new ArrayList<>();
            for (Seat seat : seats) {
                ShowSeat ss = new ShowSeat();
                ss.setShowtime(st);
                ss.setSeat(seat);
                BigDecimal price = st.getBasePrice().multiply(seat.getPriceMultiplier());
                ss.setEffectivePrice(price);
                ss.setStatus(ShowSeatStatus.AVAILABLE);
                toCreate.add(ss);
            }
            existing = showSeatRepository.saveAll(toCreate);
        } else {
            // Refresh expired holds before returning
            releaseExpiredHolds();
        }
        return existing.stream().map(showSeatMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public List<ShowSeatDTO> holdSeats(Long showtimeId, List<Long> seatIds, User user, int ttlSeconds) {
        releaseExpiredHolds();
        Showtime st = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new ResourceNotFoundException("Showtime not found: " + showtimeId));
        List<ShowSeat> affected = new ArrayList<>();
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expires = now.plusSeconds(Math.max(60, Math.min(ttlSeconds, 900))); // 1–15 minutes
        for (Long seatId : seatIds) {
            ShowSeat ss = showSeatRepository.findByShowtime_IdAndSeat_Id(showtimeId, seatId);
            if (ss == null) {
                // create if missing
                Seat seat = seatRepository.findById(seatId).orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));
                if (!seat.getRoom().getId().equals(st.getRoom().getId())) {
                    throw new OperationNotAllowedException("Seat does not belong to showtime room");
                }
                ss = new ShowSeat();
                ss.setShowtime(st);
                ss.setSeat(seat);
                ss.setEffectivePrice(st.getBasePrice().multiply(seat.getPriceMultiplier()));
            }
            if (ss.getStatus() == ShowSeatStatus.SOLD || ss.getStatus() == ShowSeatStatus.BLOCKED) {
                throw new OperationNotAllowedException("Seat already sold or blocked");
            }
            SeatHold hold = seatHoldRepository.findByShowSeat_IdAndUser_Id(ss.getId(), user.getId()).orElse(null);
            if (ss.getStatus() == ShowSeatStatus.HOLD) {
                if (hold == null) {
                    // Seat is being held by someone else
                    throw new OperationNotAllowedException("Seat currently held by another user");
                }
            }

            ss.setStatus(ShowSeatStatus.HOLD);
            showSeatRepository.save(ss);

            if (hold == null) {
                hold = new SeatHold();
                hold.setShowSeat(ss);
                hold.setUser(user);
                hold.setCreatedAtUtc(now);
            }
            hold.setExpiresAtUtc(expires);
            seatHoldRepository.save(hold);
            affected.add(ss);
        }
        return affected.stream().map(showSeatMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void releaseSeats(List<Long> showSeatIds) {
        List<SeatHold> holds = seatHoldRepository.findByShowSeat_IdIn(showSeatIds);
        for (SeatHold h : holds) {
            ShowSeat ss = h.getShowSeat();
            if (ss.getStatus() == ShowSeatStatus.HOLD) ss.setStatus(ShowSeatStatus.AVAILABLE);
            showSeatRepository.save(ss);
        }
        seatHoldRepository.deleteAll(holds);
    }

    @Transactional
    public void releaseExpiredHolds() {
        OffsetDateTime now = OffsetDateTime.now();
        List<SeatHold> expired = seatHoldRepository.findByExpiresAtUtcBefore(now);
        for (SeatHold h : expired) {
            ShowSeat ss = h.getShowSeat();
            if (ss.getStatus() == ShowSeatStatus.HOLD) ss.setStatus(ShowSeatStatus.AVAILABLE);
            showSeatRepository.save(ss);
        }
        if (!expired.isEmpty()) seatHoldRepository.deleteAll(expired);
    }
}
