package com.example.phuocloc.bookingmovieticket.request.Author;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AuthorUpdateDTO {
    
    private String name;

    private String bio;

    private String imageUrl;

    private String imagePublicId;

    private LocalDate birthDate;


}
