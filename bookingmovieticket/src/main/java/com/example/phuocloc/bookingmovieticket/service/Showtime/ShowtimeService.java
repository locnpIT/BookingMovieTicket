package com.example.phuocloc.bookingmovieticket.service.Showtime;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.dto.Showtime.ShowtimeDTO;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.ShowtimeMapper;
import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.model.Room;
import com.example.phuocloc.bookingmovieticket.model.Showtime;
import com.example.phuocloc.bookingmovieticket.repository.MovieRepository;
import com.example.phuocloc.bookingmovieticket.repository.BookingRepository;
import com.example.phuocloc.bookingmovieticket.repository.RoomRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowtimeRepository;
import com.example.phuocloc.bookingmovieticket.request.Showtime.ShowtimeCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Showtime.ShowtimeUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final ShowtimeMapper showtimeMapper;
    private final BookingRepository bookingRepository;

    public List<ShowtimeDTO> listByFilters(Long movieId, Long roomId, LocalDate date, String q) {
        OffsetDateTime start = null;
        OffsetDateTime end = null;
        if (date != null) {
            ZoneId zone = ZoneId.systemDefault();
            start = date.atStartOfDay(zone).toOffsetDateTime();
            end = date.plusDays(1).atStartOfDay(zone).toOffsetDateTime();
        }
        List<Showtime> items = showtimeRepository.findByFilters(movieId, roomId, start, end, (q == null || q.isBlank()) ? null : q);
        return items.stream().map(showtimeMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ShowtimeDTO create(ShowtimeCreateDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + dto.getMovieId()));
        Room room = roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));

        OffsetDateTime start = dto.getStartTime();
        OffsetDateTime end = start.plusMinutes(movie.getDuration());

        long overlaps = showtimeRepository.countOverlaps(room.getId(), start, end, null);
        if (overlaps > 0) {
            throw new OperationNotAllowedException("Schedule overlaps with an existing showtime in the same room");
        }

        Showtime s = new Showtime();
        s.setMovie(movie);
        s.setRoom(room);
        s.setStartTime(start);
        s.setEndTime(end);
        s.setBasePrice(dto.getBasePrice());
        // status may remain null or default as per entity; not changing behavior
        Showtime saved = showtimeRepository.save(s);
        return showtimeMapper.toDTO(saved);
    }

    @Transactional
    public ShowtimeDTO update(Long id, ShowtimeUpdateDTO dto) {
        Showtime s = showtimeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));

        if (dto.getRoomId() != null) {
            Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));
            s.setRoom(room);
        }
        if (dto.getStartTime() != null) {
            s.setStartTime(dto.getStartTime());
            // endTime recalculated from movie duration
            Movie m = s.getMovie();
            s.setEndTime(dto.getStartTime().plusMinutes(m.getDuration()));
        }
        if (dto.getBasePrice() != null) {
            s.setBasePrice(dto.getBasePrice());
        }
        if (dto.getStatus() != null) {
            s.setStatus(dto.getStatus());
        }

        // Validate overlap with current values
        long overlaps = showtimeRepository.countOverlaps(s.getRoom().getId(), s.getStartTime(), s.getEndTime(), s.getId());
        if (overlaps > 0) {
            throw new OperationNotAllowedException("Schedule overlaps with an existing showtime in the same room");
        }

        Showtime saved = showtimeRepository.save(s);
        return showtimeMapper.toDTO(saved);
    }

    @Transactional
    public void delete(Long id) {
        Showtime s = showtimeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
        long bookingCount = bookingRepository.countByShowtime_Id(id);
        if (bookingCount > 0) {
            throw new OperationNotAllowedException("Không thể xoá suất chiếu vì đã có vé/đặt chỗ");
        }
        showtimeRepository.delete(s);
    }
}
