package com.example.phuocloc.bookingmovieticket.request.Province;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProvinceCreateDTO {
    @NotBlank
    private String name;
}

