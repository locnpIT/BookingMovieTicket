package com.example.phuocloc.bookingmovieticket.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.phuocloc.bookingmovieticket.dto.Author.AuthorDTO;
import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorCreateDTO;

@Mapper(componentModel = "spring")
public interface AuthorMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target= "movies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imagePublicId", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    Author toEntity(AuthorCreateDTO dto);

    AuthorDTO toDTO(Author author);

    List<AuthorDTO> toListDTO(List<Author> authors);

    
}
