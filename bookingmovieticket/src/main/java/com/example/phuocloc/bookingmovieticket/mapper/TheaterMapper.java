package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Theater.TheaterDTO;
import com.example.phuocloc.bookingmovieticket.model.Theater;

@Mapper(componentModel = "spring")
public interface TheaterMapper {
    @Mapping(target = "provinceId", source = "province.id")
    @Mapping(target = "provinceName", source = "province.name")
    TheaterDTO toDTO(Theater t);
    List<TheaterDTO> toListDTO(List<Theater> items);
}

