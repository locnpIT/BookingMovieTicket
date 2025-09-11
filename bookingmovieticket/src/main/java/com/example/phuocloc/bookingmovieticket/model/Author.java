package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@RequiredArgsConstructor
public class Author extends BaseEntity{

    @Column(nullable = false, length = 255)
    private String name;

    private LocalDate birthDate;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(length = 255)
    private String imagePublicId;


    @ManyToMany(mappedBy = "authors", fetch = FetchType.LAZY)
    private Set<Movie> movies = new HashSet<>();

}
