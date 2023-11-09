package ecoders.polareco.member.service;

import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.exception.PolarecoException;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.event.event.EmailVerificationCodeIssueEvent;
import ecoders.polareco.member.repository.MemberRepository;
import ecoders.polareco.member.util.VerificationCodeIssuer;
import ecoders.polareco.redis.service.RedisService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class MemberService {

    private final RedisService redisService;

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
            throw new PolarecoException(ExceptionCode.EMAIL_VERIFICATION_CODE_MISMATCH);
        }
        redisService.deleteEmailVerificationCode(email);
    }

    public void signup(Member member) {
        encodePassword(member);
        memberRepository.save(member);
    }

    private void checkExistingMemberByEmail(String email) {
        Member existingMember = memberRepository.findByEmail(email);
        if (existingMember != null) {
            log.error("Member corresponding to the email already exists : {}", email);
            throw new PolarecoException(ExceptionCode.MEMBER_ALREADY_EXISTS);
        }
    }

    private void encodePassword(Member member) {
        String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);
    }
}
