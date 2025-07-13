package com.example.phuocloc.bookingmovieticket.security.jwt;

import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.phuocloc.bookingmovieticket.exception.JwtValidationException;
import com.example.phuocloc.bookingmovieticket.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtility {

    private static final String SECRET_KEY_ALGORITHM = "HmacSHA512";

    @Value("${app.security.jwt.issuer}")
    private String issuerName;

    @Value("${app.security.jwt.secret}")
    private String secretKey;

    @Value("${app.security.jwt.access-token.expiration}")
    private int accessTokenExpiration;

    public String generateAccessToken(User user){

        if(user == null || user.getId() == null || user.getEmail() == null || user.getRole().getName() == null){
            throw new IllegalArgumentException("User object is null or its fields have null value");
        }

        long expirationTimeInMillis = System.currentTimeMillis() + accessTokenExpiration * 60000;

        String subject = String.format("%s%s", user.getId(), user.getEmail());
        return Jwts.builder()
            .subject(subject)
            .issuer(issuerName)
            .issuedAt(new Date())
            .expiration(new Date(expirationTimeInMillis))
            .claim("email", user.getEmail())
            .claim("role_id", user.getRole().getId())
            .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), io.jsonwebtoken.SignatureAlgorithm.HS512)
            .compact();
    }

    public Claims validateAccessToken(String token) throws JwtValidationException{

        try{
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), SECRET_KEY_ALGORITHM);
            return Jwts.parser()
            .verifyWith(keySpec)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        }catch(ExpiredJwtException ex){
            throw new JwtValidationException("Access token expired", ex);
        }catch(IllegalArgumentException ex){
            throw new JwtValidationException("Access token is illegal", ex);
        }catch(MalformedJwtException ex){
            throw new JwtValidationException("Access token is not well formed", ex);
        }catch(UnsupportedJwtException ex){
            throw new JwtValidationException("Access token is not supported", ex);
        }


    }

    

}
