package com.example.phuocloc.bookingmovieticket.service.Author;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.phuocloc.bookingmovieticket.dto.Author.AuthorDTO;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.AuthorMapper;
import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.repository.AuthorRespository;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRespository authorRespository;
    private final AuthorMapper authorMapper;
    private final AuthorImageAsyncService authorImageAsyncService;

    public AuthorDTO createAuthor(AuthorCreateDTO request, MultipartFile file){
        Author author = authorMapper.toEntity(request);
        Author saved = authorRespository.save(author);
        if(file != null && !file.isEmpty()){
            try{
                byte[] bytes = file.getBytes();
                authorImageAsyncService.uploadAndUpdate(saved.getId(), bytes);
            }
            catch(IOException ex){
                throw new RuntimeException("Không đọc được file upload: " + ex.getMessage(), ex);
            }
        }
        return authorMapper.toDTO(saved);
    }

    public List<AuthorDTO> getAllAuthorDTOs(){
        List<Author> authors = authorRespository.findAll();
        return authorMapper.toListDTO(authors);
    }

    public AuthorDTO patchUpdate(Long id, AuthorUpdateDTO request){
        Optional<Author> optionalAuthor = authorRespository.findById(id);
        if(!optionalAuthor.isPresent()){
            throw new ResourceNotFoundException("Không tìm thấy author với id = " + id);
        }
        else{
            Author author = optionalAuthor.get();
            if(request.getName() != null){
                author.setName(request.getName());
            }
            if(request.getBio() != null){
                author.setBio(request.getBio());
            }
            if(request.getBirthDate() != null){
                author.setBirthDate(request.getBirthDate());
            } 
            if(request.getImageUrl() != null){
                author.setImageUrl(request.getImageUrl());
            }
            if(request.getImagePublicId() != null){
                author.setImagePublicId(request.getImagePublicId());
            }
            Author updated = authorRespository.save(author);
            return authorMapper.toDTO(updated);
        }
    }




    
}
