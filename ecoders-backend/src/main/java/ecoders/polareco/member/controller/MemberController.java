package ecoders.polareco.member.controller;

import ecoders.polareco.member.dto.*;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@AllArgsConstructor
@RestController
@Slf4j
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

    @GetMapping("/member/my-info")
    public ResponseEntity<MemberInfoDto> getMyInfo(@AuthenticationPrincipal String email) {
        Member member = memberService.findMemberByEmail(email);
        return ResponseEntity.ok(new MemberInfoDto(member));
    }

    @PostMapping("/password/forgot/issue")
    public ResponseEntity<?> sendPasswordResetMail(@RequestBody @Valid EmailDto emailDto) {
        memberService.sendPasswordResetMail(emailDto.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/password/forgot/verification")
    public ResponseEntity<?> verifyPasswordResetToken(@RequestBody PasswordResetVerificationDto dto) {
        memberService.verifyPasswordResetToken(dto.getEmail(), dto.getToken());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/password/forgot/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid PasswordResetDto dto) {
        memberService.resetPassword(dto.getEmail(), dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
