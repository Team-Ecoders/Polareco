package ecoders.polareco.member.dto;

import ecoders.polareco.member.validation.annotation.EmailVerificationCode;
import lombok.Getter;

import javax.validation.constraints.Email;

@Getter
public class EmailVerificationCodeDto {

    @Email
    private String email;

    @EmailVerificationCode
    private String verificationCode;
}
