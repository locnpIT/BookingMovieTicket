package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Banner extends BaseEntity {

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Title is required!")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 2000)
    @NotBlank(message = "Image URL is required!")
    private String imageUrl;

    @Column(length = 2000)
    private String linkUrl; // Link khi click banner (ví dụ: /movie/{id})

    @Column(nullable = false)
    @NotNull(message = "Start date is required!")
    private LocalDateTime startDate;

    @Column(nullable = false)
    @NotNull(message = "End date is required!")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BannerStatus status = BannerStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = true) 
    private Movie movie;

    public enum BannerStatus {
        ACTIVE, INACTIVE, DRAFT
    }
}