package com.example.phuocloc.bookingmovieticket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.Director.DirectorDTO;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.DirectorMapper;
import com.example.phuocloc.bookingmovieticket.model.Director;
import com.example.phuocloc.bookingmovieticket.repository.DirectorRepository;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Director.DirectorUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectorService {
    
    private final DirectorRepository directorRepository;
    private final DirectorMapper directorMapper;

    public DirectorDTO createDirector(DirectorCreateDTO directorCreateDTO){
        Director director = this.directorMapper.toEntity(directorCreateDTO);
        Director savedDirector = this.directorRepository.save(director);
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
          
            Director updatedDirector = this.directorRepository.save(director);  
          
            return directorMapper.toDTO(updatedDirector);
        }
    }

    public List<DirectorDTO> getAllDirectors(){

        List<Director> listDirectors = this.directorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        return this.directorMapper.toListDTO(listDirectors);
    }




}
