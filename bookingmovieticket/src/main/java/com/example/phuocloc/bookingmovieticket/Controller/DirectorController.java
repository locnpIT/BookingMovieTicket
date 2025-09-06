package com.example.phuocloc.bookingmovieticket.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Director.DirectorDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.DirectorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/directors")
@RequiredArgsConstructor
public class DirectorController {
    
    private final DirectorService directorService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DirectorDTO>> createDirector(@RequestBody @Valid DirectorCreateDTO createRequest){
        
        DirectorDTO director = this.directorService.createDirector(createRequest);

        ApiResponse<DirectorDTO> response = new ApiResponse<>(
            true,
            "Create director success",
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
        List<DirectorDTO> directors = directorService.getAllDirector();
        return ResponseEntity.ok(directors);
    }
    



}
