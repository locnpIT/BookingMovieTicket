package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class CheckoutSession extends BaseEntity {

    @Column(unique = true, length = 50, nullable = false)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String showSeatIdsCsv;

    @Column(nullable = false)
    private OffsetDateTime createdAtUtc;

    @Column
    private OffsetDateTime expiresAtUtc;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private com.example.phuocloc.bookingmovieticket.enums.PaymentStatus status = com.example.phuocloc.bookingmovieticket.enums.PaymentStatus.PENDING;
}

