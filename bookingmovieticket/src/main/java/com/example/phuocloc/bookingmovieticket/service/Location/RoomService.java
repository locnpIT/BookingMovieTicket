package com.example.phuocloc.bookingmovieticket.service.Location;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.Room.RoomDTO;
import com.example.phuocloc.bookingmovieticket.dto.Seat.SeatDTO;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.RoomMapper;
import com.example.phuocloc.bookingmovieticket.mapper.SeatMapper;
import com.example.phuocloc.bookingmovieticket.model.Room;
import com.example.phuocloc.bookingmovieticket.model.Theater;
import com.example.phuocloc.bookingmovieticket.repository.RoomRepository;
import com.example.phuocloc.bookingmovieticket.repository.SeatRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowtimeRepository;
import com.example.phuocloc.bookingmovieticket.repository.TheaterRepository;
import com.example.phuocloc.bookingmovieticket.request.Room.RoomCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Room.RoomUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final TheaterRepository theaterRepository;
    private final ShowtimeRepository showtimeRepository;
    private final RoomMapper roomMapper;
    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;

    public List<RoomDTO> list(Long theaterId) {
        List<Room> items = theaterId != null ? roomRepository.findByTheater_Id(theaterId) : roomRepository.findAll();
        return roomMapper.toListDTO(items);
    }

    public RoomDTO create(RoomCreateDTO dto) {
        Theater t = theaterRepository.findById(dto.getTheaterId())
            .orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + dto.getTheaterId()));
        Room r = new Room();
        r.setRoomNumber(dto.getRoomNumber());
        r.setCapacity(dto.getCapacity());
        r.setType(dto.getType());
        r.setTheater(t);
        return roomMapper.toDTO(roomRepository.save(r));
    }

    public RoomDTO update(Long id, RoomUpdateDTO dto) {
        Room r = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        if (dto.getRoomNumber() != null) r.setRoomNumber(dto.getRoomNumber());
        if (dto.getCapacity() != null) r.setCapacity(dto.getCapacity());
        if (dto.getType() != null) r.setType(dto.getType());
        if (dto.getTheaterId() != null) {
            Theater t = theaterRepository.findById(dto.getTheaterId())
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + dto.getTheaterId()));
            r.setTheater(t);
        }
        return roomMapper.toDTO(roomRepository.save(r));
    }

    public void delete(Long id) {
        Room r = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        long shows = showtimeRepository.countByRoom_Id(id);
        if (shows > 0) throw new OperationNotAllowedException("Không thể xoá phòng vì còn suất chiếu");
        roomRepository.delete(r);
    }

    public List<SeatDTO> listSeats(Long roomId) {
        Room r = roomRepository.findById(roomId).orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));
        return seatMapper.toListDTO(seatRepository.findByRoom_Id(r.getId()));
    }
}
