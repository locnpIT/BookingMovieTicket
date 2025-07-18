package com.example.phuocloc.bookingmovieticket.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.example.phuocloc.bookingmovieticket.exception.JwtValidationException;
import com.example.phuocloc.bookingmovieticket.model.Role;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.RoleRepository;
import com.example.phuocloc.bookingmovieticket.security.CustomUserDetails;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {


    @Autowired JwtUtility jwtUltil;
    @Autowired RoleRepository roleRepository;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    HandlerExceptionResolver exceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // TODO Auto-generated method stub

        if(!hasAuthorizationBearer(request)){
            filterChain.doFilter(request, response);
            return;
        }
        String token = getBearerToken(request);

        try{
            Claims claims = jwtUltil.validateAccessToken(token);

            UserDetails userDetails = getUserDetails(claims);

            setAuthenticationContext(userDetails, request);

            filterChain.doFilter(request, response);
            
            clearAuthenticationContext();

        }
        catch(JwtValidationException ex){
            exceptionResolver.resolveException(request, response, null, ex);
        }
        

    }

    private void clearAuthenticationContext(){
        SecurityContextHolder.clearContext();
    }

    private void setAuthenticationContext(UserDetails userDetails, HttpServletRequest request){
        var authentication = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities());
        
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    
    }

    private boolean hasAuthorizationBearer(HttpServletRequest request){
        String header = request.getHeader("Authorization");

        if(ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")){
            return false;
        }

        return true;

    }

    private String getBearerToken(HttpServletRequest request){
        String header = request.getHeader("Authorization");

        String array[] = header.split(" ");
        if(array.length == 2) return array[1];

        return null;
    }

    private UserDetails getUserDetails(Claims claims){

        String subject = (String)claims.get(claims.SUBJECT);
        
        String []array = subject.split(",");

        Long userId = Long.valueOf(array[0]);
        String email = array[1];

        User user = new User();
        user.setId(userId);
        user.setEmail(email);
        
        // String roleString = (String)claims.get("role_id");

        Number roleIdNum = (Number) claims.get("role_id");
        Long roleId = roleIdNum.longValue();
        Role role = roleRepository.findById(roleId).get();

        user.setRole(role);

        return new CustomUserDetails(user);
    }





    
    
}
