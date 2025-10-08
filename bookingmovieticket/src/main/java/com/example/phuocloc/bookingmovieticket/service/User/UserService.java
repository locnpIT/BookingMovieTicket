package com.example.phuocloc.bookingmovieticket.service.User;

import com.example.phuocloc.bookingmovieticket.dto.User.UserDTO;
import com.example.phuocloc.bookingmovieticket.exception.DuplicateResourceException;
import com.example.phuocloc.bookingmovieticket.exception.OperationNotAllowedException;
import com.example.phuocloc.bookingmovieticket.exception.ResourceNotFoundException;
import com.example.phuocloc.bookingmovieticket.mapper.UserMapper;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.repository.UserRepository;
import com.example.phuocloc.bookingmovieticket.request.UserCreateDTO;
import com.example.phuocloc.bookingmovieticket.request.User.ChangePasswordRequest;
import com.example.phuocloc.bookingmovieticket.request.User.UserProfileUpdateRequest;
import com.example.phuocloc.bookingmovieticket.service.Email.EmailService;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserDTO saveUser(UserCreateDTO dto) {
        
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        String otp = generateVertificationCode();
        
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setVerificationCode(otp);

        User saved = userRepository.save(user);


        String verifyUrl = "http://localhost:8080/api/oauth/verify?email=" + user.getEmail() + "&code=" + otp;

        emailService.sendVerificationLinkEmail(user.getEmail(), verifyUrl);

        return userMapper.toDTO(saved);
    }

    private String generateVertificationCode(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public boolean verifyUser(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.isVerified() && code.equals(user.getVerificationCode())) {
                user.setVerified(true);
                user.setVerificationCode(null); // clear code
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }


    @Transactional
    public UserDTO updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());

        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new OperationNotAllowedException("Mật khẩu hiện tại không chính xác");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new OperationNotAllowedException("Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }



    
}
