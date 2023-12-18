package ecoders.polareco.member.dto;

import lombok.Getter;

@Getter
public class PasswordResetVerificationDto {

    private String email;

    private String token;
}
