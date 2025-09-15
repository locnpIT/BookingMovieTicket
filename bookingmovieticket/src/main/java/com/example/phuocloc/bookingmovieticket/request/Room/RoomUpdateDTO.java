package com.example.phuocloc.bookingmovieticket.request.Room;

import com.example.phuocloc.bookingmovieticket.enums.RoomType;

import lombok.Data;

@Data
public class RoomUpdateDTO {
    private String roomNumber;
    private Integer capacity;
    private RoomType type;
    private Long theaterId;
}

