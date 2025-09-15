package com.example.phuocloc.bookingmovieticket.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Showtime.ShowtimeDTO;
import com.example.phuocloc.bookingmovieticket.model.Showtime;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {

    @Mapping(target = "movieId", source = "movie.id")
    @Mapping(target = "movieTitle", source = "movie.title")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomNumber", source = "room.roomNumber")
    ShowtimeDTO toDTO(Showtime showtime);

}

