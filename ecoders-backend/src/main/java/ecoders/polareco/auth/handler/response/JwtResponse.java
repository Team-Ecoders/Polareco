package ecoders.polareco.auth.handler.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class JwtResponse {

    private String accessToken;

    private String refreshToken;
}
