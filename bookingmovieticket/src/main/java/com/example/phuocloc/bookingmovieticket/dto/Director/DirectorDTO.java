package com.example.phuocloc.bookingmovieticket.dto.Director;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DirectorDTO {
    private String name;
    private LocalDate birthDate;
    private String bio;
    private String imageUrl;
}
