package com.example.phuocloc.bookingmovieticket.service.Author;

import java.io.IOException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.repository.AuthorRespository;
import com.example.phuocloc.bookingmovieticket.service.Cloudinary.CloudinaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorImageAsyncService {
    
    private final CloudinaryService cloudinaryService;
    private final AuthorRespository authorRespository;

    @Async("taskExecutor")
    public void uploadAndUpdate(Long authorId, byte[] fileBytes) {
        
        String uploadedPublicId = null;
        try {
            Author author = authorRespository.findById(authorId).orElse(null);
            if(author == null){
                log.warn("Author not found for async upload, id={}", authorId);
                return;
            }
                
            if(author.getImagePublicId() != null && !author.getImagePublicId().isBlank()){
                try {
                    cloudinaryService.deleteImage(uploadedPublicId);
                } catch (IOException delException) {
                    log.warn("Failed to delete old image for author {}: {}", authorId, delException.getMessage());
                }
            }
            CloudinaryService.UploadResult result = cloudinaryService.uploadImageBytes(fileBytes, "authors/" + authorId);
            uploadedPublicId = result.getPublicId();
            author.setImageUrl(result.getUrl());
            author.setImagePublicId(result.getPublicId());
            authorRespository.save(author);
        
        }catch(Exception ex){
            log.error("Async upload failed for author {}: {}", authorId, ex.getMessage(), ex);
            if(uploadedPublicId != null){
                try {
                    cloudinaryService.deleteImage(uploadedPublicId);
                } catch (IOException ignore) { }
            }
        }


    }


}
