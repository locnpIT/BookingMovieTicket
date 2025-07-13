package com.example.phuocloc.bookingmovieticket.security.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.security.jwt.JwtUtility;

@Service
public class TokenService {
    
    @Value("${app.security.jwt.refresh-token.expiration}")
    private int refreshTokenExpiration;

    @Autowired JwtUtility jwtUtility;

    @Autowired PasswordEncoder passwordEncoder;

    public AuthResponse generatetoken(User user) {
        String accessToken = jwtUtility.generateAccessToken(user);
        AuthResponse response = new AuthResponse();

        response.setAccessToken(accessToken);
    
        return response;
    }

}
