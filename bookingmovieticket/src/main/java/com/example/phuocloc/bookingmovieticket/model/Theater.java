package com.example.phuocloc.bookingmovieticket.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Theater extends BaseEntity{
    
    @NotBlank(message = "Name is required!")
    private String name;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    @Column(length = 500)
    @NotBlank(message = "Address is required!")
    private String address;
    
    @Column(length = 20)
    @Pattern(regexp = "^\\+?[0-9]{10,20}$", message = "Invalid phone number!")
    private String phoneNumber;

    // sau nayf dung google map
    private Double latitude;
    private Double longitude;

    @Column(length = 1000)
    private String imageUrl;

    

    @OneToMany(mappedBy = "theater", fetch = FetchType.LAZY)
    private Set<Room> rooms = new HashSet<>();

    
}
