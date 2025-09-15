package com.example.phuocloc.bookingmovieticket.dto.Theater;

import lombok.Data;

@Data
public class TheaterDTO {
    private Long id;
    private String name;
    private Long provinceId;
    private String provinceName;
    private String address;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
}

