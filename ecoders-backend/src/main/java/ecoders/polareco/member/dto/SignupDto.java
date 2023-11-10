package ecoders.polareco.member.dto;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.validation.annotation.Password;
import ecoders.polareco.member.validation.annotation.Username;
import lombok.Getter;

import javax.validation.constraints.Email;

@Getter
public class SignupDto {

    @Email
    private String email;

    @Username
    private String username;

    @Password
    private String password;

    public Member toMember() {
        return new Member(email, username, password);
    }
}
