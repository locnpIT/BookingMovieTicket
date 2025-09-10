package com.example.phuocloc.bookingmovieticket.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.service.AuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAuthorStats() {
        long total = authorService.countAll();
        long withImage = authorService.countWithImage();
        return ResponseEntity.ok(Map.of(
            "totalAuthors", total,
            "authorsWithImage", withImage,
            "authorsWithoutImage", Math.max(0L, total - withImage)
        ));
    }
}

