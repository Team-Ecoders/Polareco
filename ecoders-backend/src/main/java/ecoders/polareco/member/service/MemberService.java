package ecoders.polareco.member.service;

import ecoders.polareco.aws.service.S3Service;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.event.event.EmailVerificationCodeIssueEvent;
import ecoders.polareco.member.event.event.PasswordResetTokenIssueEvent;
import ecoders.polareco.member.repository.MemberRepository;
import ecoders.polareco.member.util.VerificationCodeIssuer;
import ecoders.polareco.redis.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class MemberService {

    @Value("${client-url}")
    private String clientUrl;

    private final RedisService redisService;

    private final S3Service s3Service;

    private final MemberRepository memberRepository;

    private final ApplicationEventPublisher eventPublisher;

    private final PasswordEncoder passwordEncoder;

    public void issueEmailVerificationCode(String email) {
        checkExistingMemberByEmail(email);
        String verificationCode = VerificationCodeIssuer.issue();
        redisService.saveEmailVerificationCode(email, verificationCode);
        eventPublisher.publishEvent(new EmailVerificationCodeIssueEvent(email, verificationCode));
    }

    public void verifyEmail(String email, String verificationCode) {
        String savedVerificationCode = redisService.getEmailVerificationCode(email);
        if (!savedVerificationCode.equals(verificationCode)) {
            throw new BusinessLogicException(ExceptionCode.EMAIL_VERIFICATION_CODE_MISMATCH);
        }
        redisService.deleteEmailVerificationCode(email);
    }

    public void signup(Member member) {
        String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);
        memberRepository.save(member);
    }

    public void sendPasswordResetMail(String email) {
        Member member = findMemberByEmail(email);
        String token = UUID.randomUUID().toString();
        redisService.savePasswordResetToken(member.getEmail(), token);
        eventPublisher.publishEvent(new PasswordResetTokenIssueEvent(clientUrl, member.getEmail(), token));
    }

    public void resetPassword(String email, String token, String newPassword) {
        Member member = findMemberByEmail(email);
        verifyPasswordResetToken(member.getEmail(), token);
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        member.setPassword(encodedNewPassword);
        memberRepository.save(member);
        redisService.deletePasswordResetToken(email);
    }

    public void verifyPasswordResetToken(String email, String token) {
        String savedToken = redisService.getPasswordResetToken(email);
        if (!savedToken.equals(token)) {
            throw new BusinessLogicException(ExceptionCode.PASSWORD_RESET_TOKEN_MISMATCH);
        }
    }

    public String updateProfileImage(String email, MultipartFile imageFile) {
        Member member = findMemberByEmail(email);
        String profileImageUrl = s3Service.uploadImage(imageFile, S3Service.ImageType.PROFILE);
        member.setProfileImage(profileImageUrl);
        memberRepository.save(member);
        return profileImageUrl;
    }

    public void updatePassword(String email, String currentPassword, String newPassword) {
        Member member = findMemberByEmail(email);
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new BusinessLogicException(ExceptionCode.PASSWORD_MISMATCH);
        }
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
    }

    public Member findMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND);
        }
        return member;
    }

    private void checkExistingMemberByEmail(String email) {
        Member existingMember = memberRepository.findByEmail(email);
        if (existingMember != null) {
            log.error("Member corresponding to the email already exists : {}", email);
            throw new BusinessLogicException(ExceptionCode.MEMBER_ALREADY_EXISTS);
        }
    }

    public boolean checkIsGoogleMember(String email) {
        Member member = findMemberByEmail(email);
        return !member.hasPassword();
    }
}
