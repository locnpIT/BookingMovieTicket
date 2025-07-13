package com.example.phuocloc.bookingmovieticket.security.auth;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;

@RestController
@RequestMapping("/api/oauth")
public class AuthController {

    @Autowired AuthenticationManager authenticationManager;

    @Autowired TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> getAccessToken(AuthRequest request){
        String email = request.getEmail();
        String password = request.getPassword();

        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            
            CustomUserDetails userDetails = (CustomUserDetails)authentication.getPrincipal();
            AuthResponse response = tokenService.generatetoken(userDetails.getUser());

            return ResponseEntity.ok(response);
        
        }catch(BadCredentialsException ex){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
    
}
