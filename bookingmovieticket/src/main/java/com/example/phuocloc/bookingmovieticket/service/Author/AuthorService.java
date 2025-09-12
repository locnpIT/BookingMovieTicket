package com.example.phuocloc.bookingmovieticket.service.Author;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.phuocloc.bookingmovieticket.dto.Author.AuthorDTO;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.AuthorMapper;
import com.example.phuocloc.bookingmovieticket.model.Author;
import com.example.phuocloc.bookingmovieticket.repository.AuthorRespository;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Author.AuthorUpdateDTO;
import com.example.phuocloc.bookingmovieticket.service.Cloudinary.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRespository authorRespository;
    private final AuthorMapper authorMapper;
    private final AuthorImageAsyncService authorImageAsyncService;
    private final CloudinaryService cloudinaryService;

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
        List<Author> authors = authorRespository.findAll(Sort.by("name").ascending());
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

    public AuthorDTO getAuthorById(Long id){
        Author author = authorRespository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy author với id = " + id));
        return authorMapper.toDTO(author);
    }

    public Page<AuthorDTO> getAuthorsPaged(int page, int size){
        Page<Author> p = authorRespository.findAll(PageRequest.of(page, size, Sort.by("name").ascending()));
        return p.map(authorMapper::toDTO);
    }

    public void deleteAuthor(Long id){
        Author author = authorRespository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy author với id = " + id));
        try {
            if (author.getImagePublicId() != null && !author.getImagePublicId().isBlank()) {
                cloudinaryService.deleteImage(author.getImagePublicId());
            }
        } catch (IOException ignore) {}
        authorRespository.delete(author);
    }
    public AuthorDTO uploadAuthorImage(Long id, MultipartFile file){
        Author author = authorRespository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy author với id = " + id));

        if(file != null && !file.isEmpty()){
            try{
                byte[] bytes = file.getBytes();
                authorImageAsyncService.uploadAndUpdate(id, bytes);
            } catch (IOException ex){
                throw new RuntimeException("Không đọc được file upload: " + ex.getMessage(), ex);
            }
        }

        return authorMapper.toDTO(author);
    }



    
}
