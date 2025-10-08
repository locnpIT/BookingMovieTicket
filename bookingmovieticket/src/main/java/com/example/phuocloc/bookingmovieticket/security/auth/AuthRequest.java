package com.example.phuocloc.bookingmovieticket.security.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
