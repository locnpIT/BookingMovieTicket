package com.example.phuocloc.bookingmovieticket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationLinkEmail(String toEmail, String verifyLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔐 Xác minh tài khoản của bạn");

            String html = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                    + "<h2 style='color: #2e86de;'>🎉 Hoàn tất đăng ký</h2>"
                    + "<p>Chào mừng bạn đã đăng kí thành công tài khoản tại PhuocLocCinema!</p>"
                    + "<p>Vui lòng nhấn vào nút bên dưới để xác minh tài khoản:</p>"
                    + "<a href='" + verifyLink + "' style='display: inline-block; padding: 10px 20px; "
                    + "background-color: #2e86de; color: white; text-decoration: none; border-radius: 5px;'>"
                    + "Xác minh tài khoản</a>"
                    + "<p style='margin-top:20px; font-size: 12px;'>Nếu bạn không đăng ký, hãy bỏ qua email này.</p>"
                    + "</div>";

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Không gửi được email xác minh", e);
        }
    }

}
