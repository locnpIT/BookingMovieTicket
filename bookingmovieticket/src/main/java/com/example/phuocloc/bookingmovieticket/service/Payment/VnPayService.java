package com.example.phuocloc.bookingmovieticket.service.Payment;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.config.VnPayProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VnPayService {
    private final VnPayProperties props;

    public String createPaymentUrl(String orderCode, long amountVnd, String clientIp) {
        try {
            String tmnCode = props.getTmnCode() != null ? props.getTmnCode().trim() : "";
            String hashSecret = props.getHashSecret() != null ? props.getHashSecret().trim() : "";
            if (tmnCode.isEmpty() || hashSecret.isEmpty()) {
                throw new IllegalStateException("VNPay configuration is missing tmnCode/hashSecret");
            }

            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", "2.1.0");
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_TmnCode", tmnCode);
            vnpParams.put("vnp_Amount", String.valueOf(amountVnd * 100));
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", orderCode);
            vnpParams.put("vnp_OrderInfo", "Thanh toan don dat ve " + orderCode);
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", props.getReturnUrl());
            if (props.getIpnUrl() != null) vnpParams.put("vnp_IpnUrl", props.getIpnUrl());
            vnpParams.put("vnp_IpAddr", clientIp != null ? clientIp : "127.0.0.1");
            OffsetDateTime now = OffsetDateTime.now();
            vnpParams.put("vnp_CreateDate", now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
            vnpParams.put("vnp_ExpireDate", now.plusMinutes(10).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

            String query = buildQuery(vnpParams);
            String sign = hmacSHA512(hashSecret, query);
            String payUrl = props.getPayUrl()
                + "?" + query
                + "&vnp_SecureHashType=HmacSHA512"
                + "&vnp_SecureHash=" + sign;
            log.info("VNPay Query: {}", query);
            log.info("VNPay Sign: {}", sign);
            log.info("VNPay URL: {}", payUrl);
            return payUrl;
        } catch (Exception ex) {
            throw new RuntimeException("Create VNPay URL failed: " + ex.getMessage(), ex);
        }
    }

    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) return false;
        Map<String, String> sorted = new TreeMap<>();
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (!"vnp_SecureHash".equals(e.getKey()) && !"vnp_SecureHashType".equals(e.getKey())) {
                sorted.put(e.getKey(), e.getValue());
            }
        }
        String data = buildQuery(sorted);
        String expected = hmacSHA512(props.getHashSecret(), data);
        return expected.equalsIgnoreCase(receivedHash);
    }

    private static String buildQuery(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (!first) sb.append('&');
            sb.append(encode(e.getKey())).append('=');
            sb.append(encode(e.getValue()));
            first = false;
        }
        return sb.toString();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] raw = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) sb.append(String.format("%02X", b));
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to sign VNPay request", ex);
        }
    }
}
