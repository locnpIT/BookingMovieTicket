package com.example.phuocloc.bookingmovieticket.exception;


public class JwtValidationException extends Exception{

    public JwtValidationException(String message, Throwable cause){
        super(message, cause);
    }


}