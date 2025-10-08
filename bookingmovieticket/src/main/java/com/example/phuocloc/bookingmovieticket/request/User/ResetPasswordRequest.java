package com.example.phuocloc.bookingmovieticket.request.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    @NotBlank(message = "Token không hợp lệ")
    private String token;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được bỏ trống")
    private String confirmPassword;
}
