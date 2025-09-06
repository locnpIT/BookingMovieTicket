package com.example.phuocloc.bookingmovieticket.mapper;

import com.example.phuocloc.bookingmovieticket.dto.User.UserDTO;
import com.example.phuocloc.bookingmovieticket.model.User;
import com.example.phuocloc.bookingmovieticket.request.UserCreateDTO;

import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = RoleMapperHelper.class)
public interface UserMapper {

    // Map entity -> DTO
    @Mapping(target = "roleName", source = "role.name")
    UserDTO toDTO(User user);

    // Map request DTO -> entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "avatarUrl", constant = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg")
    @Mapping(target = "verificationCode", ignore = true)
    @Mapping(target = "verified", constant = "false")
    @Mapping(target = "role", source = ".", qualifiedByName = "mapDefaultRole")
    User toEntity(UserCreateDTO dto);
}
