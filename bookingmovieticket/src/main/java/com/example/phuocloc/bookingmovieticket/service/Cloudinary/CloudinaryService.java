package com.example.phuocloc.bookingmovieticket.service.Cloudinary;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.Value;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public UploadResult uploadImage(MultipartFile file, String folder) throws IOException {
        Map<String, Object> params = new HashMap<>();
        params.put("folder", folder);
        params.put("resource_type", "image");
        params.put("overwrite", true);

        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
        String secureUrl = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");
        return new UploadResult(secureUrl, publicId);
    }

    public UploadResult uploadImageBytes(byte[] bytes, String folder) throws IOException {
        Map<String, Object> params = new HashMap<>();
        params.put("folder", folder);
        params.put("resource_type", "image");
        params.put("overwrite", true);

        Map<?, ?> result = cloudinary.uploader().upload(bytes, params);
        String secureUrl = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");
        return new UploadResult(secureUrl, publicId);
    }

    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isBlank()) return;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    @Value
    public static class UploadResult {
        String url;
        String publicId;
    }
}

