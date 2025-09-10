package com.example.phuocloc.bookingmovieticket.service;

import java.io.IOException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DirectorImageAsyncService {

    private final CloudinaryService cloudinaryService;
    private final DirectorRepository directorRepository;

    @Async("taskExecutor")
    public void uploadAndUpdate(Long directorId, byte[] fileBytes) {
        String uploadedPublicId = null;
        try {
            Director director = directorRepository.findById(directorId).orElse(null);
            if (director == null) {
                log.warn("Director not found for async upload, id={}", directorId);
                return;
            }

            if (director.getImagePublicId() != null && !director.getImagePublicId().isBlank()) {
                try {
                    cloudinaryService.deleteImage(director.getImagePublicId());
                } catch (IOException delEx) {
                    log.warn("Failed to delete old image for director {}: {}", directorId, delEx.getMessage());
                }
            }

            CloudinaryService.UploadResult result = cloudinaryService.uploadImageBytes(fileBytes, "directors/" + directorId);
            uploadedPublicId = result.getPublicId();
            director.setImageUrl(result.getUrl());
            director.setImagePublicId(result.getPublicId());
            directorRepository.save(director);
        } catch (Exception ex) {
            log.error("Async upload failed for director {}: {}", directorId, ex.getMessage(), ex);
            if (uploadedPublicId != null) {
                try {
                    cloudinaryService.deleteImage(uploadedPublicId);
                } catch (IOException ignore) { }
            }
        }
    }
}

