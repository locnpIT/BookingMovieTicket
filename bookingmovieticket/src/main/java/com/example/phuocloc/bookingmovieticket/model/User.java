package com.example.phuocloc.bookingmovieticket.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Index;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="user",
   uniqueConstraints=@UniqueConstraint(name="uk_user_email", columnNames="email"),
   indexes=@Index(name="idx_user_role", columnList="role_id"))
@Getter
@Setter
@RequiredArgsConstructor
public class User extends BaseEntity{
    
    @NotBlank(message = "FirstName is required!")
    private String firstName;
    
    @NotBlank(message = "Last Name is required!")
    private String lastName;
    
    @Email(message = "Invalid email format!")
    private String email;
    
    @Column(length = 20)
    @Pattern(regexp = "^\\+?[0-9]{10,20}$", message = "Invalid phone number")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password is at least 6 character!")
    private String password;
    
    @Column(length = 6)
    private String verificationCode;

    
    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

    @Column(nullable = false)
    private boolean isVerified = false;

    private OffsetDateTime lastLogin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;





}
