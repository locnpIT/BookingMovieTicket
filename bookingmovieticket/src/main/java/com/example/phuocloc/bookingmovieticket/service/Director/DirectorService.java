package com.example.phuocloc.bookingmovieticket.service.Director;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.phuocloc.bookingmovieticket.dto.Director.DirectorDTO;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.DirectorMapper;
import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorUpdateDTO;
import com.example.phuocloc.bookingmovieticket.service.Cloudinary.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectorService {
    
    private final DirectorRepository directorRepository;
    private final DirectorMapper directorMapper;
    private final CloudinaryService cloudinaryService;
    private final DirectorImageAsyncService directorImageAsyncService;

    public DirectorDTO createDirector(DirectorCreateDTO directorCreateDTO){
        Director director = this.directorMapper.toEntity(directorCreateDTO);
        Director savedDirector = this.directorRepository.save(director);
        return directorMapper.toDTO(savedDirector);
    }

    public DirectorDTO createDirector(DirectorCreateDTO directorCreateDTO, MultipartFile file){
        Director director = this.directorMapper.toEntity(directorCreateDTO);
        Director savedDirector = this.directorRepository.save(director);

        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                directorImageAsyncService.uploadAndUpdate(savedDirector.getId(), bytes);
            } catch (IOException ex) {
                throw new RuntimeException("Không đọc được file upload: " + ex.getMessage(), ex);
            }
        }

        return directorMapper.toDTO(savedDirector);
    }

    public DirectorDTO patchUpdate(Long id, DirectorUpdateDTO directorUpdateDTO){

        Optional<Director> updateDirector = this.directorRepository.findById(id);

        if(!updateDirector.isPresent()){
            throw new ResourceNotFoundException("Can not find director with id = " + id);
        }
        else {
            Director director = updateDirector.get();
           
            if(directorUpdateDTO.getName() != null) director.setName(directorUpdateDTO.getName());
            if(directorUpdateDTO.getBio() != null) director.setBio(directorUpdateDTO.getBio());
            if(directorUpdateDTO.getBirthDate() != null) director.setBirthDate(directorUpdateDTO.getBirthDate());
            if(directorUpdateDTO.getImageUrl() != null) director.setImageUrl(directorUpdateDTO.getImageUrl());
            if(directorUpdateDTO.getImagePublicId() != null) director.setImagePublicId(directorUpdateDTO.getImagePublicId());
          
            Director updatedDirector = this.directorRepository.save(director);  
          
            return directorMapper.toDTO(updatedDirector);
        }
    }

    public List<DirectorDTO> getAllDirectors(){

        List<Director> listDirectors = this.directorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        return this.directorMapper.toListDTO(listDirectors);
    }

    public Page<DirectorDTO> getDirectorsPaged(int page, int size) {
        Page<Director> p = directorRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name")));
        return p.map(directorMapper::toDTO);
    }

    public DirectorDTO uploadDirectorImage(Long id, MultipartFile file) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Can not find director with id = " + id));

        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                directorImageAsyncService.uploadAndUpdate(id, bytes);
            } catch (IOException ex) {
                throw new RuntimeException("Không đọc được file upload: " + ex.getMessage(), ex);
            }
        }

        return directorMapper.toDTO(director);
    }

    public void deleteDirector(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Can not find director with id = " + id));
        try {
            if (director.getImagePublicId() != null && !director.getImagePublicId().isBlank()) {
                cloudinaryService.deleteImage(director.getImagePublicId());
            }
        } catch (IOException ignore) { }
        directorRepository.delete(director);
    }
}
