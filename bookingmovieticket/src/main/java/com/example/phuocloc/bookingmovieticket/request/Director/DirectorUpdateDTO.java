package com.example.phuocloc.bookingmovieticket.request.Director;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DirectorUpdateDTO {
    
    private String name;
    private LocalDate birthDate;
    private String bio;
    private String imageUrl;
    private String imagePublicId;

}
