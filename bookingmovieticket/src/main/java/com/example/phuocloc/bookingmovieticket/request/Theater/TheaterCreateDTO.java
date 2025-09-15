package com.example.phuocloc.bookingmovieticket.request.Theater;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TheaterCreateDTO {
    @NotBlank
    private String name;
    @NotNull
    private Long provinceId;
    @NotBlank
    private String address;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
}

