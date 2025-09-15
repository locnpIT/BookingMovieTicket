package com.example.phuocloc.bookingmovieticket.dto.Room;

import com.example.phuocloc.bookingmovieticket.enums.RoomType;

import lombok.Data;

@Data
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private int capacity;
    private RoomType type;
    private Long theaterId;
    private String theaterName;
}

