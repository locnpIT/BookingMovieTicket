package com.example.phuocloc.bookingmovieticket.mapper;

import com.example.phuocloc.bookingmovieticket.model.Role;
import com.example.phuocloc.bookingmovieticket.repository.RoleRepository;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class RoleMapperHelper {

    private final RoleRepository roleRepository;

    public RoleMapperHelper(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Named("mapDefaultRole")
    public Role mapDefaultRole(Object source) {
        return roleRepository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("Default role with id 1 not found"));
    }
}
