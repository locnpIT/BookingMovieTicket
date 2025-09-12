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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
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


    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
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
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
        
    }

    @GetMapping
    public ResponseEntity<List<AuthorDTO>> getAllAuthors(){

        List<AuthorDTO> authors = this.authorService.getAllAuthorDTOs();
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDTO> getAuthorById(@PathVariable Long id){
        return ResponseEntity.ok(this.authorService.getAuthorById(id));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthorDTO>> uploadAuthorImage(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file
    ){
        AuthorDTO current = this.authorService.uploadAuthorImage(id, file);
        ApiResponse<AuthorDTO> response = new ApiResponse<>(
            true,
            "Đã nhận file. Ảnh đang được tải lên nền.",
            current,
            HttpStatus.ACCEPTED.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @GetMapping("/paged")
    public ResponseEntity<?> getAuthorsPaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        return ResponseEntity.ok(this.authorService.getAuthorsPaged(page, size));
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAuthor(@PathVariable Long id){
        this.authorService.deleteAuthor(id);
        ApiResponse<Void> response = new ApiResponse<>(
            true,
            "Xoá tác giả thành công!",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }
    
}
