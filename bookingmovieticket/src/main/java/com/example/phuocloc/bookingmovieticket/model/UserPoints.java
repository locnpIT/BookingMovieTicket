package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_points",
    uniqueConstraints = @UniqueConstraint(name = "uk_user_points_user", columnNames = "user_id"))
@Getter
@Setter
@RequiredArgsConstructor
public class UserPoints extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal points = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private OffsetDateTime lastUpdated = OffsetDateTime.now();
    
    public void addPoints(BigDecimal amount) {
        this.points = this.points.add(amount);
        this.lastUpdated = OffsetDateTime.now();
    }
    
    public void deductPoints(BigDecimal amount) {
        if (this.points.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient points");
        }
        this.points = this.points.subtract(amount);
        this.lastUpdated = OffsetDateTime.now();
    }
}

