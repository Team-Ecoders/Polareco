package ecoders.polareco.member.event.listener;

import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.event.event.PasswordResetTokenIssueEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@Component
@Slf4j
public class PasswordResetTokenIssueEventListener {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;

    @Async
    @TransactionalEventListener
    public void sendPasswordResetMail(PasswordResetTokenIssueEvent event) {
        try {
            mailSender.send(passwordResetMessage(event));
            log.info("비밀번호 재설정 메일 발송 완료: {}", event.getEmail());
        } catch (MessagingException exception) {
            log.info("메일 작성 실패: {}", exception.toString());
            throw new BusinessLogicException(ExceptionCode.MAIL_MESSAGING_FAILED);
        }
    }

    private MimeMessage passwordResetMessage(PasswordResetTokenIssueEvent event) throws MessagingException {
        Context context = setContext(event);
        String template = "password-reset";
        String htmlMessage = templateEngine.process(template, context);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setSubject("[Polareco] 비밀번호 재설정 메일");
        mimeMessageHelper.setTo(event.getEmail());
        mimeMessageHelper.setText(htmlMessage, true);
        return mimeMessage;
    }

    private Context setContext(PasswordResetTokenIssueEvent event) {
        Context context = new Context();
        Map<String, Object> variables = new HashMap<>();
        variables.put("clientUrl", event.getClientUrl());
        variables.put("email", event.getEmail());
        variables.put("token", event.getToken());
        log.info("variables: {}", variables);
        context.setVariables(variables);
        return context;
    }
}
