package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.phuocloc.bookingmovieticket.dto.Province.ProvinceDTO;
import com.example.phuocloc.bookingmovieticket.model.Province;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
    ProvinceDTO toDTO(Province p);
    List<ProvinceDTO> toListDTO(List<Province> items);
}

