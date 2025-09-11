package com.example.phuocloc.bookingmovieticket.dto.Author;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AuthorDTO {

    private Long id;

    private String name;

    private String bio;

    private String imageUrl;

    private String imagePublicId;

    private LocalDate birthDate;


}
