package com.example.phuocloc.bookingmovieticket.model;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Product extends BaseEntity {
    
    @Column(nullable = false, length = 100)
    @NotBlank(message = "Name is required!")
    private String name;

    @Column(nullable = false)
    @DecimalMin(value = "0.00", message = "Price must be positive!")
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    @Min(value = 0, message = "Inventory must be positive!")
    private int inventory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BookingProduct> bookingProducts = new HashSet<>();
    

}
