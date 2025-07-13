package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Director extends BaseEntity {

    @Column(length = 255, nullable = false)
    private String name;

    private LocalDate birthDate;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 1000)
    private String imageUrl;

    @ManyToMany(mappedBy = "directors", fetch = FetchType.LAZY)
    private Set<Movie> movies = new HashSet<>();

    
}
