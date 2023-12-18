package ecoders.polareco.member.event.listener;

import ecoders.polareco.member.event.event.EmailVerificationCodeIssueEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@AllArgsConstructor
@Component
@Slf4j
public class EmailVerificationCodeIssueEventListener {

    private final JavaMailSender mailSender;

    @Async
    @TransactionalEventListener
    public void sendEmailVerificationCode(EmailVerificationCodeIssueEvent event) {
        mailSender.send(writeSimpleMailMessage(event));
        log.info("Sent verification code: {}", event.getEmail());
    }

    private SimpleMailMessage writeSimpleMailMessage(EmailVerificationCodeIssueEvent event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("[Polareco] 이메일 인증 코드");
        message.setTo(event.getEmail());
        message.setText("회원가입 페이지에서 아래 인증 코드를 입력해 주세요.\n" + event.getVerificationCode());
        return message;
    }
}
