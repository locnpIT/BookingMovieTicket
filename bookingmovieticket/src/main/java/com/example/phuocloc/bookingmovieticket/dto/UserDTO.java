package com.example.phuocloc.bookingmovieticket.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private boolean isVerified;
    private String avatarUrl;
    private LocalDate dateOfBirth;
    private OffsetDateTime lastLogin;
    private String roleName;
}