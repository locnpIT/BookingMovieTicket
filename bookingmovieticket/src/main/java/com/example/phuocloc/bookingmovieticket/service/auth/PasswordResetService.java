package com.example.phuocloc.bookingmovieticket.service.auth;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.model.PasswordResetToken;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.PasswordResetTokenRepository;
import com.example.phuocloc.bookingmovieticket.repository.UserRepository;
import com.example.phuocloc.bookingmovieticket.request.User.ResetPasswordRequest;
import com.example.phuocloc.bookingmovieticket.service.Email.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.password-reset.expiration-minutes}")
    private long passwordResetExpirationMinutes;

    @Value("${app.security.password-reset.frontend-url}")
    private String passwordResetFrontendUrl;

    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return; // tránh tiết lộ email tồn tại hay không
        }

        User user = userOpt.get();

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiresAt(OffsetDateTime.now().plusMinutes(passwordResetExpirationMinutes));
        token.setUsed(false);

        passwordResetTokenRepository.save(token);

        String resetLink = String.format("%s?token=%s", passwordResetFrontendUrl, token.getToken());
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    @Transactional(readOnly = true)
    public void validateToken(String tokenValue) {
        PasswordResetToken token = passwordResetTokenRepository.findByTokenAndUsedFalse(tokenValue)
            .orElseThrow(() -> new OperationNotAllowedException("Token đặt lại mật khẩu không hợp lệ"));
        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new OperationNotAllowedException("Token đặt lại mật khẩu đã hết hạn");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new OperationNotAllowedException("Mật khẩu xác nhận không khớp");
        }

        PasswordResetToken token = passwordResetTokenRepository.findByTokenAndUsedFalse(request.getToken())
            .orElseThrow(() -> new OperationNotAllowedException("Token đặt lại mật khẩu không hợp lệ"));

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new OperationNotAllowedException("Token đặt lại mật khẩu đã hết hạn");
        }

        User user = token.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }
}
