package com.example.phuocloc.bookingmovieticket.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Director.DirectorDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Director.DirectorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;


@RestController
@RequestMapping("/api/directors")
@RequiredArgsConstructor
public class DirectorController {
    
    private final DirectorService directorService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DirectorDTO>> createDirector(
            @Valid @ModelAttribute DirectorCreateDTO createRequest,
            @RequestPart(value = "file", required = false) MultipartFile file){

        DirectorDTO director = this.directorService.createDirector(createRequest, file);

        ApiResponse<DirectorDTO> response = new ApiResponse<>(
            true,
            file != null && !file.isEmpty() ? "Tạo đạo diễn thành công! Ảnh đang được tải lên nền." : "Tạo đạo diễn thành công!",
            director,
            HttpStatus.CREATED.value(),
            LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DirectorDTO>> updateDirector(@PathVariable Long id ,@RequestBody @Valid DirectorUpdateDTO updateRequest){

        DirectorDTO director = this.directorService.patchUpdate(id, updateRequest);

        ApiResponse<DirectorDTO> response = new ApiResponse<DirectorDTO>(true,
         "Update director success", 
         director,
          HttpStatus.OK.value(), 
           LocalDateTime.now() );


        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @GetMapping
    public ResponseEntity<List<DirectorDTO>> getAllDirectors() {
        List<DirectorDTO> directors = directorService.getAllDirectors();
        return ResponseEntity.ok(directors);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<DirectorDTO>> getDirectorsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<DirectorDTO> result = directorService.getDirectorsPaged(page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DirectorDTO>> uploadDirectorImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        DirectorDTO current = directorService.uploadDirectorImage(id, file);
        ApiResponse<DirectorDTO> response = new ApiResponse<>(
            true,
            "Đã nhận file. Ảnh đang được tải lên nền.",
            current,
            HttpStatus.ACCEPTED.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDirector(@PathVariable Long id) {
        directorService.deleteDirector(id);
        ApiResponse<Void> response = new ApiResponse<>(
            true,
            "Xoá đạo diễn thành công!",
            null,
            HttpStatus.OK.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }
    



}
