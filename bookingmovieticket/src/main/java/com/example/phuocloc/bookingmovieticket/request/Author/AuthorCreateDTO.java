package com.example.phuocloc.bookingmovieticket.request.Author;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AuthorCreateDTO {
    
    private String name;

    private String bio;

    private String imageUrl;

    private LocalDate birthDate;

    private String imagePublicId;


}
