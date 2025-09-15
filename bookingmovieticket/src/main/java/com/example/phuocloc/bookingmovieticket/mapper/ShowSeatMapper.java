package com.example.phuocloc.bookingmovieticket.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Seat.ShowSeatDTO;
import com.example.phuocloc.bookingmovieticket.model.ShowSeat;

@Mapper(componentModel = "spring")
public interface ShowSeatMapper {
    @Mapping(target = "showSeatId", source = "id")
    @Mapping(target = "seatId", source = "seat.id")
    @Mapping(target = "seatNumber", source = "seat.seatNumber")
    @Mapping(target = "seatType", source = "seat.type")
    ShowSeatDTO toDTO(ShowSeat ss);
}

