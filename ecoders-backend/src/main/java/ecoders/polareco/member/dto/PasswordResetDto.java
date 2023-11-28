package ecoders.polareco.member.dto;

import ecoders.polareco.member.validation.annotation.Password;
import lombok.Getter;

import javax.validation.constraints.Email;

@Getter
public class PasswordResetDto {

    @Email
    private String email;

    private String token;

    @Password
    private String newPassword;
}
