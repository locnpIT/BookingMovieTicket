package com.example.phuocloc.bookingmovieticket.service.Location;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.phuocloc.bookingmovieticket.dto.Province.ProvinceDTO;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.ProvinceMapper;
import com.example.phuocloc.bookingmovieticket.model.Province;
import com.example.phuocloc.bookingmovieticket.repository.ProvinceRepository;
import com.example.phuocloc.bookingmovieticket.repository.TheaterRepository;
import com.example.phuocloc.bookingmovieticket.request.Province.ProvinceCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Province.ProvinceUpdateDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProvinceService {
    private final ProvinceRepository provinceRepository;
    private final TheaterRepository theaterRepository;
    private final ProvinceMapper provinceMapper;

    public List<ProvinceDTO> list() {
        return provinceMapper.toListDTO(provinceRepository.findAll());
    }

    public ProvinceDTO create(ProvinceCreateDTO dto) {
        Province p = new Province();
        p.setName(dto.getName());
        return provinceMapper.toDTO(provinceRepository.save(p));
    }

    public ProvinceDTO update(Long id, ProvinceUpdateDTO dto) {
        Province p = provinceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Province not found: " + id));
        if (dto.getName() != null) p.setName(dto.getName());
        return provinceMapper.toDTO(provinceRepository.save(p));
    }

    public void delete(Long id) {
        Province p = provinceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Province not found: " + id));
        // block if province has theaters
        boolean hasTheaters = !theaterRepository.findByProvince_Id(id).isEmpty();
        if (hasTheaters) throw new OperationNotAllowedException("Không thể xoá tỉnh/thành vì còn rạp thuộc tỉnh này");
        provinceRepository.delete(p);
    }
}

