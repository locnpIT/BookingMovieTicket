package com.example.phuocloc.bookingmovieticket.service;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.repository.AuthorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;

    public long countAll() {
        return authorRepository.count();
    }

    public long countWithImage() {
        try {
            return authorRepository.countByImageUrlIsNotNull();
        } catch (Exception e) {
            return 0L;
        }
    }
}

