package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.phuocloc.bookingmovieticket.dto.Seat.SeatDTO;
import com.example.phuocloc.bookingmovieticket.model.Seat;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    SeatDTO toDTO(Seat seat);
    List<SeatDTO> toListDTO(List<Seat> seats);
}

