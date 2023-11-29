package ecoders.polareco.member.dto;

import ecoders.polareco.member.validation.annotation.Password;
import lombok.Getter;

@Getter
public class PasswordUpdateDto {

    private String currentPassword;

    @Password
    private String newPassword;
}
