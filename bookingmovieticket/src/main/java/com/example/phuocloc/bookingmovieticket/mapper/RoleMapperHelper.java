package com.example.phuocloc.bookingmovieticket.mapper;

import com.example.phuocloc.bookingmovieticket.model.Role;
import com.example.phuocloc.bookingmovieticket.repository.RoleRepository;

import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RoleMapperHelper {

    private final RoleRepository roleRepository;

    public RoleMapperHelper(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Named("mapDefaultRole")
    public Role mapDefaultRole(Object source) {
        String roleName = defaultRoleName != null ? defaultRoleName.trim() : "USER";
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Default role '" + roleName + "' not found"));
    }

    @Value("${app.security.default-role:USER}")
    private String defaultRoleName;
}
