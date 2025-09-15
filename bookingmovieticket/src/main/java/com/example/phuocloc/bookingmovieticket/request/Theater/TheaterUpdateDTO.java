package com.example.phuocloc.bookingmovieticket.request.Theater;

import lombok.Data;

@Data
public class TheaterUpdateDTO {
    private String name;
    private Long provinceId;
    private String address;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
}

