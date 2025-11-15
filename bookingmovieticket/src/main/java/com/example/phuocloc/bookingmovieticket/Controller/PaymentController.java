package com.example.phuocloc.bookingmovieticket.Controller;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Booking.BookingDTO;
import com.example.phuocloc.bookingmovieticket.model.CheckoutSession;
import com.example.phuocloc.bookingmovieticket.model.SeatHold;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.SeatHoldRepository;
import com.example.phuocloc.bookingmovieticket.repository.ShowSeatRepository;
import com.example.phuocloc.bookingmovieticket.repository.CheckoutSessionRepository;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;
import com.example.phuocloc.bookingmovieticket.service.Booking.BookingFlowService;
import com.example.phuocloc.bookingmovieticket.service.Payment.VnPayService;
import com.example.phuocloc.bookingmovieticket.service.Game.GameService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {
    private final VnPayService vnPayService;
    private final SeatHoldRepository seatHoldRepository;
    private final ShowSeatRepository showSeatRepository;
    private final CheckoutSessionRepository checkoutRepo;
    private final BookingFlowService bookingFlowService;
    private final GameService gameService;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Data
    public static class CheckoutRequest {
        private List<Long> showSeatIds;
        private BigDecimal pointsToUse = BigDecimal.ZERO; // Points to use for discount
    }

    @PostMapping("/bookings/checkout")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<String>> checkout(@Valid @RequestBody CheckoutRequest req, Authentication auth, HttpServletRequest http) {
        User user = ((CustomUserDetails) auth.getPrincipal()).getUser();
        if (req.getShowSeatIds() == null || req.getShowSeatIds().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "No seats selected", null, HttpStatus.BAD_REQUEST.value(), java.time.LocalDateTime.now()));
        }

        // Validate holds belong to this user and not expired
        List<SeatHold> holds = seatHoldRepository.findByShowSeat_IdIn(req.getShowSeatIds());
        if (holds.size() != req.getShowSeatIds().size()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false, "Some seats are not held", null, HttpStatus.CONFLICT.value(), java.time.LocalDateTime.now()));
        }
        OffsetDateTime now = OffsetDateTime.now();
        for (SeatHold h : holds) {
            if (h.getExpiresAtUtc().isBefore(now)) return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false, "Seat hold expired", null, HttpStatus.CONFLICT.value(), java.time.LocalDateTime.now()));
            if (!h.getUser().getId().equals(user.getId())) return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false, "Seat held by another user", null, HttpStatus.CONFLICT.value(), java.time.LocalDateTime.now()));
        }

        // Calculate amount
        var seats = showSeatRepository.findByIdIn(req.getShowSeatIds());
        BigDecimal total = seats.stream().map(s -> s.getEffectivePrice()).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Apply points discount if requested
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal pointsToUse = req.getPointsToUse() != null ? req.getPointsToUse() : BigDecimal.ZERO;
        if (pointsToUse.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal userPoints = gameService.getUserPoints(user);
            if (userPoints.compareTo(pointsToUse) < 0) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Không đủ điểm để sử dụng", null, HttpStatus.BAD_REQUEST.value(), java.time.LocalDateTime.now()));
            }
            discountAmount = gameService.pointsToVndDiscount(pointsToUse);
            // Discount cannot exceed total amount
            if (discountAmount.compareTo(total) > 0) {
                discountAmount = total;
                pointsToUse = gameService.vndDiscountToPoints(total);
            }
            // Deduct points (will be refunded if payment fails)
            gameService.usePointsForDiscount(user, pointsToUse);
        }
        
        BigDecimal finalAmount = total.subtract(discountAmount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        // Create checkout session
        String orderCode = "BK" + System.currentTimeMillis();
        CheckoutSession cs = new CheckoutSession();
        cs.setOrderCode(orderCode);
        cs.setUser(user);
        cs.setAmount(finalAmount); // Store final amount after discount
        cs.setShowSeatIdsCsv(req.getShowSeatIds().stream().map(String::valueOf).collect(Collectors.joining(",")));
        cs.setCreatedAtUtc(now);
        cs.setExpiresAtUtc(now.plusMinutes(15));
        checkoutRepo.save(cs);

        String clientIp = getClientIp(http);
        String payUrl = vnPayService.createPaymentUrl(orderCode, finalAmount.longValue(), clientIp);
        ApiResponse<String> res = new ApiResponse<>(true, "Tạo liên kết thanh toán thành công", payUrl, HttpStatus.OK.value(), java.time.LocalDateTime.now());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/payment/vnpay/return")
    public ResponseEntity<?> vnpReturn(@RequestParam MultiValueMap<String,String> allParams, Authentication auth) {
        Map<String,String> p = allParams.toSingleValueMap();
        boolean ok = vnPayService.verifySignature(p);
        String respCode = p.get("vnp_ResponseCode");
        String orderCode = p.get("vnp_TxnRef");
        if (!ok || orderCode == null) {
            return redirectResult("fail", "Checksum invalid", null);
        }
        if (!"00".equals(respCode)) {
            return redirectResult("fail", "Thanh toán không thành công", null);
        }

        CheckoutSession cs = checkoutRepo.findByOrderCode(orderCode).orElse(null);
        if (cs == null) {
            return redirectResult("fail", "Order not found", null);
        }

        // Parse showSeatIds from CSV
        List<Long> showSeatIds = Arrays.stream(cs.getShowSeatIdsCsv().split(",")).filter(s -> !s.isBlank()).map(Long::valueOf).collect(Collectors.toList());
        User user;
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails cud) {
            user = cud.getUser();
        } else {
            user = cs.getUser();
        }

        // Calculate discount from checkout session
        var seats = showSeatRepository.findByIdIn(showSeatIds);
        BigDecimal originalAmount = seats.stream().map(s -> s.getEffectivePrice()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discountAmount = originalAmount.subtract(cs.getAmount());
        
        BookingDTO dto = bookingFlowService.confirm(user, showSeatIds, discountAmount);
        cs.setStatus(com.example.phuocloc.bookingmovieticket.enums.PaymentStatus.SUCCESS);
        checkoutRepo.save(cs);
        return redirectResult("success", null, dto.getBookingCode());
    }

    private ResponseEntity<?> redirectResult(String status, String message, String bookingCode) {
        StringBuilder sb = new StringBuilder(frontendBaseUrl);
        if (!frontendBaseUrl.endsWith("/")) sb.append('/');
        sb.append("payment/result?").append("status=").append(encode(status));
        if (message != null) sb.append("&message=").append(encode(message));
        if (bookingCode != null) sb.append("&bookingCode=").append(encode(bookingCode));
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(sb.toString())).build();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isBlank()) {
            ipAddress = request.getRemoteAddr();
        } else {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        if (ipAddress == null || ipAddress.isBlank()) {
            return "127.0.0.1";
        }
        if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
            return "127.0.0.1";
        }
        return ipAddress;
    }
}
