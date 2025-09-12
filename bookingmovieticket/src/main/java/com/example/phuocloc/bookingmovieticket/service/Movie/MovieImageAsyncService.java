package com.example.phuocloc.bookingmovieticket.service.Movie;

import java.io.IOException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.Movie;
import com.example.phuocloc.bookingmovieticket.repository.MovieRepository;
import com.example.phuocloc.bookingmovieticket.service.Cloudinary.CloudinaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieImageAsyncService {

    private final CloudinaryService cloudinaryService;
    private final MovieRepository movieRepository;

    @Async("taskExecutor")
    public void uploadAndUpdate(Long movieId, byte[] fileBytes) {
        String uploadedPublicId = null;
        try {
            Movie movie = movieRepository.findById(movieId).orElse(null);
            if (movie == null) {
                log.warn("Movie not found for async upload, id={}", movieId);
                return;
            }

            if (movie.getImagePublicId() != null && !movie.getImagePublicId().isBlank()) {
                try {
                    cloudinaryService.deleteImage(movie.getImagePublicId());
                } catch (IOException delEx) {
                    log.warn("Failed to delete old image for movie {}: {}", movieId, delEx.getMessage());
                }
            }

            CloudinaryService.UploadResult result = cloudinaryService.uploadImageBytes(fileBytes, "movies/" + movieId);
            uploadedPublicId = result.getPublicId();
            movie.setImageUrl(result.getUrl());
            movie.setImagePublicId(result.getPublicId());
            movieRepository.save(movie);
        } catch (Exception ex) {
            log.error("Async upload failed for movie {}: {}", movieId, ex.getMessage(), ex);
            if (uploadedPublicId != null) {
                try {
                    cloudinaryService.deleteImage(uploadedPublicId);
                } catch (IOException ignore) { }
            }
        }
    }
}

