package com.example.phuocloc.bookingmovieticket.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/oauth")
public class UserController {
    
    private final UserService userService;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> postMethodName(@RequestBody User user) {
        
        String rawPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));
        userService.saveUser(user);
        return ResponseEntity.ok().body(user);
    }
    

}
