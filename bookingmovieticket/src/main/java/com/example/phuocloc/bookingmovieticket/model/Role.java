package com.example.phuocloc.bookingmovieticket.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Role extends BaseEntity{

    
    @Column(name = "name", length = 50, unique = true)
    @NotBlank(message = "Name is required!")
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();
    


    
}
