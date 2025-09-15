package com.example.phuocloc.bookingmovieticket.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.phuocloc.bookingmovieticket.dto.Province.ProvinceDTO;
import com.example.phuocloc.bookingmovieticket.request.Province.ProvinceCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.Province.ProvinceUpdateDTO;
import com.example.phuocloc.bookingmovieticket.response.ApiResponse;
import com.example.phuocloc.bookingmovieticket.service.Location.ProvinceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/provinces")
@RequiredArgsConstructor
public class ProvinceController {
  private final ProvinceService provinceService;

  @GetMapping
  public ResponseEntity<List<ProvinceDTO>> list() {
    return ResponseEntity.ok(provinceService.list());
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<ProvinceDTO>> create(@RequestBody @Valid ProvinceCreateDTO dto) {
    ProvinceDTO created = provinceService.create(dto);
    ApiResponse<ProvinceDTO> res = new ApiResponse<>(true, "Tạo tỉnh/thành thành công!", created, HttpStatus.CREATED.value(), LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.CREATED).body(res);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<ProvinceDTO>> update(@PathVariable Long id, @RequestBody @Valid ProvinceUpdateDTO dto) {
    ProvinceDTO updated = provinceService.update(id, dto);
    ApiResponse<ProvinceDTO> res = new ApiResponse<>(true, "Cập nhật tỉnh/thành công!", updated, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
    provinceService.delete(id);
    ApiResponse<Void> res = new ApiResponse<>(true, "Xoá thành công!", null, HttpStatus.OK.value(), LocalDateTime.now());
    return ResponseEntity.ok(res);
  }
}

