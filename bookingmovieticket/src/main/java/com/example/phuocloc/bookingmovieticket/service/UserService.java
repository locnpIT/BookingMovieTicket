package com.example.phuocloc.bookingmovieticket.service;

import com.example.phuocloc.bookingmovieticket.dto.UserDTO;
import com.example.phuocloc.bookingmovieticket.mapper.UserMapper;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.UserRepository;
import com.example.phuocloc.bookingmovieticket.request.UserCreateDTO;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO saveUser(UserCreateDTO dto) {

        String otp = generateVertificationCode();
        
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setVerificationCode(otp);

        User saved = userRepository.save(user);


        String verifyUrl = "http://localhost:8080/api/oauth/verify?email=" + user.getEmail() + "&code=" + otp;

        emailService.sendVerificationLinkEmail(user.getEmail(), verifyUrl);

        return userMapper.toDTO(saved);
    }

    private String generateVertificationCode(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public boolean verifyUser(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.isVerified() && code.equals(user.getVerificationCode())) {
                user.setVerified(true);
                user.setVerificationCode(null); // clear code
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }



    
}