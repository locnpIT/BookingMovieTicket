package com.example.phuocloc.bookingmovieticket.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.phuocloc.bookingmovieticket.model.Role;
import com.example.phuocloc.bookingmovieticket.repository.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedRoles(RoleRepository roleRepository){
        return args -> {
            ensureRole(roleRepository, "ADMIN", "Administrator role");
            ensureRole(roleRepository, "USER", "Default user role");
        };
    }

    private void ensureRole(RoleRepository repo, String name, String description){
        repo.findByName(name).orElseGet(() -> {
            Role r = new Role();
            r.setName(name);
            r.setDescription(description);
            return repo.save(r);
        });
    }
}

