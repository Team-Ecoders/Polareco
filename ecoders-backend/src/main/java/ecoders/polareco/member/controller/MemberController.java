package ecoders.polareco.member.controller;

import ecoders.polareco.member.dto.EmailDto;
import ecoders.polareco.member.dto.SignupDto;
import ecoders.polareco.member.dto.EmailVerificationCodeDto;
import ecoders.polareco.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup/code/issue")
    public ResponseEntity<?> issueEmailVerificationCode(@RequestBody @Valid EmailDto emailDto) {
        memberService.issueEmailVerificationCode(emailDto.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/signup/code/verification")
    public ResponseEntity<?> verifyEmail(@RequestBody @Valid EmailVerificationCodeDto emailVerificationCodeDto) {
        String email = emailVerificationCodeDto.getEmail();
        String verificationCode = emailVerificationCodeDto.getVerificationCode();
        memberService.verifyEmail(email, verificationCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid SignupDto signupDto) {
        memberService.signup(signupDto.toMember());
        return ResponseEntity.ok().build();
    }

//    @GetMapping("/myinfo")
//    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal String email) {
//
//    }
}
