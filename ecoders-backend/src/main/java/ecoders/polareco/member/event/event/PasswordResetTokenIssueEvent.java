package ecoders.polareco.member.event.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class PasswordResetTokenIssueEvent {

    private String clientUrl;

    private String email;

    private String token;
}
