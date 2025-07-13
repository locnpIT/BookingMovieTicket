package com.example.phuocloc.bookingmovieticket.service;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    public User saveUser(User user){
        return this.userRepository.save(user);
    }

}
