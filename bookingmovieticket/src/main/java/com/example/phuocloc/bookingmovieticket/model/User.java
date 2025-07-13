package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class User extends BaseEntity{
    
    private String firstName;
    private String lastName;
    private String email;
    @Column(length = 20)
    private String phone;
    private String password;
    @Column(length = 6)
    private String verificationCode;

    
    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

    @Column(nullable = false)
    private boolean isVerified = false;

    private LocalDateTime lastLogin;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Review> reviews = new HashSet<>();




}
