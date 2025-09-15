package com.example.phuocloc.bookingmovieticket.service.Location;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.Theater.TheaterDTO;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.TheaterMapper;
import com.example.phuocloc.bookingmovieticket.model.Province;
import com.example.phuocloc.bookingmovieticket.model.Theater;
import com.example.phuocloc.bookingmovieticket.repository.ProvinceRepository;
import com.example.phuocloc.bookingmovieticket.repository.RoomRepository;
import com.example.phuocloc.bookingmovieticket.repository.TheaterRepository;
import com.example.phuocloc.bookingmovieticket.request.Theater.TheaterCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Theater.TheaterUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TheaterService {
    private final TheaterRepository theaterRepository;
    private final ProvinceRepository provinceRepository;
    private final RoomRepository roomRepository;
    private final TheaterMapper theaterMapper;

    public List<TheaterDTO> list(Long provinceId) {
        List<Theater> items = provinceId != null ? theaterRepository.findByProvince_Id(provinceId) : theaterRepository.findAll();
        return theaterMapper.toListDTO(items);
    }

    public TheaterDTO create(TheaterCreateDTO dto) {
        Province p = provinceRepository.findById(dto.getProvinceId())
            .orElseThrow(() -> new ResourceNotFoundException("Province not found: " + dto.getProvinceId()));
        Theater t = new Theater();
        t.setName(dto.getName());
        t.setProvince(p);
        t.setAddress(dto.getAddress());
        t.setPhoneNumber(dto.getPhoneNumber());
        t.setLatitude(dto.getLatitude());
        t.setLongitude(dto.getLongitude());
        t.setImageUrl(dto.getImageUrl());
        return theaterMapper.toDTO(theaterRepository.save(t));
    }

    public TheaterDTO update(Long id, TheaterUpdateDTO dto) {
        Theater t = theaterRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + id));
        if (dto.getName() != null) t.setName(dto.getName());
        if (dto.getProvinceId() != null) {
            Province p = provinceRepository.findById(dto.getProvinceId())
                .orElseThrow(() -> new ResourceNotFoundException("Province not found: " + dto.getProvinceId()));
            t.setProvince(p);
        }
        if (dto.getAddress() != null) t.setAddress(dto.getAddress());
        if (dto.getPhoneNumber() != null) t.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getLatitude() != null) t.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) t.setLongitude(dto.getLongitude());
        if (dto.getImageUrl() != null) t.setImageUrl(dto.getImageUrl());
        return theaterMapper.toDTO(theaterRepository.save(t));
    }

    public void delete(Long id) {
        Theater t = theaterRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Theater not found: " + id));
        long rooms = roomRepository.countByTheater_Id(id);
        if (rooms > 0) throw new OperationNotAllowedException("Không thể xoá rạp vì còn phòng chiếu");
        theaterRepository.delete(t);
    }
}

