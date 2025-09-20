package com.example.phuocloc.bookingmovieticket.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Getter
@Setter
public class VnPayProperties {
    private String tmnCode;
    private String hashSecret;
    private String payUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private String returnUrl; // e.g. http://localhost:8080/api/payment/vnpay/return
    private String ipnUrl;    // e.g. http://your-server.com/api/payment/vnpay/ipn
}

