package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.phuocloc.bookingmovieticket.dto.Author.AuthorDTO;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Author.AuthorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/authors")
public class AuthorController {
    
    private final AuthorService authorService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthorDTO>> createAuthor(
                    @Valid @ModelAttribute AuthorCreateDTO request, 
                    @RequestPart(value = "file", required = false) MultipartFile file) {

        AuthorDTO authorDTO = authorService.createAuthor(request, file);
        ApiResponse<AuthorDTO> response = new ApiResponse<>(
            true,
            file != null && !file.isEmpty() ? "Tạo tác giả thành công! Ảnh đang được tải lên nền." : "Tạo tác giả thành công!",
            authorDTO,
            201,
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
        
        
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuthorDTO>>> getAllAuthors(){

        ApiResponse<List<AuthorDTO>> response = new ApiResponse<List<AuthorDTO>>(
            true,
            "Lấy danh sách tác giả thành công!",
            authorService.getAllAuthorDTOs(),
            200,
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthorDTO>> patchUpdate(
        @PathVariable Long id,
        @Valid @RequestBody AuthorUpdateDTO request
    ){

        AuthorDTO authorUpdated = this.authorService.patchUpdate(id, request);

        ApiResponse<AuthorDTO> response = new ApiResponse<AuthorDTO>(
            true
        , "Tác giả đã được cập nhật thành công!"
        , authorUpdated,
         HttpStatus.OK.value(), 
         LocalDateTime.now());


        return ResponseEntity.ok(response);
    }
    






}
