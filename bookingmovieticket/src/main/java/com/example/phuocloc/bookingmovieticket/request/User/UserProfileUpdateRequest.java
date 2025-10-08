package com.example.phuocloc.bookingmovieticket.request.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateRequest {

    @NotBlank(message = "Họ không được bỏ trống")
    @Size(max = 50, message = "Họ tối đa 50 ký tự")
    private String lastName;

    @NotBlank(message = "Tên không được bỏ trống")
    @Size(max = 50, message = "Tên tối đa 50 ký tự")
    private String firstName;
}
