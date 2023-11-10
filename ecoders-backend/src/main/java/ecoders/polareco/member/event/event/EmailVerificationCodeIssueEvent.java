package ecoders.polareco.member.event.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class EmailVerificationCodeIssueEvent {

    private String email;

    private String verificationCode;
}
