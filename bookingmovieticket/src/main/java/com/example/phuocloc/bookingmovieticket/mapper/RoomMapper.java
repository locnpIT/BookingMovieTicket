package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Room.RoomDTO;
import com.example.phuocloc.bookingmovieticket.model.Room;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "theaterId", source = "theater.id")
    @Mapping(target = "theaterName", source = "theater.name")
    RoomDTO toDTO(Room r);
    List<RoomDTO> toListDTO(List<Room> items);
}

