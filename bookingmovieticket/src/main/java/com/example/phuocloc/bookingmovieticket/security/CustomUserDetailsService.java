package com.example.phuocloc.bookingmovieticket.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        Optional<User> findByEmail = userRepository.findByEmail(username);
        if(!findByEmail.isPresent()){
            throw new UsernameNotFoundException("No user found with the given email");
        }
        return new CustomUserDetails(findByEmail.get());
    }

    
    
}
