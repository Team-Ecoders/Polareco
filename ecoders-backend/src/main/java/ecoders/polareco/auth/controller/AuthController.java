package ecoders.polareco.auth.controller;

import ecoders.polareco.auth.jwt.response.JwtResponse;
import ecoders.polareco.auth.jwt.service.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/token/reissue")
    public ResponseEntity<JwtResponse> reissueAccessToken(@RequestHeader("Refresh-Token") String bearerToken) {
        JwtResponse jwtResponse = jwtService.reissueTokens(bearerToken);
        return ResponseEntity.ok(jwtResponse);
    }
}
