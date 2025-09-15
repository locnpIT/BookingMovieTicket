package com.example.phuocloc.bookingmovieticket.request.Room;

import com.example.phuocloc.bookingmovieticket.enums.RoomType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomCreateDTO {
    @NotBlank
    private String roomNumber;
    @Min(1)
    private int capacity;
    @NotNull
    private RoomType type;
    @NotNull
    private Long theaterId;
}

