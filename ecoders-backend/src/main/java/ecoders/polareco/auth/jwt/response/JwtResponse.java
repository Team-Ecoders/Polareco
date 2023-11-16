package ecoders.polareco.auth.jwt.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class JwtResponse {

    private String accessToken;

    private String refreshToken;
}
