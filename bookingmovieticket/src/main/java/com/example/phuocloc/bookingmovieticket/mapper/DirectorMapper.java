package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Director.DirectorDTO;
import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorCreateDTO;

@Mapper(componentModel = "spring")
public interface DirectorMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imagePublicId", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    Director toEntity(DirectorCreateDTO dto);
    
    DirectorDTO toDTO(Director director);

    List<DirectorDTO> toListDTO(List<Director> directors);

    
}
