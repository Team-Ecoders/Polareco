package ecoders.polareco.auth.handler;

import ecoders.polareco.auth.jwt.response.JwtResponse;
import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.auth.user.PolarecoUserDetails;
import ecoders.polareco.http.service.HttpService;
import ecoders.polareco.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@AllArgsConstructor
@Slf4j
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    private final HttpService httpService;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        Member member = ((PolarecoUserDetails) authentication.getPrincipal()).getMember();
        log.info("로그인 성공: {}", member.getEmail());
        String accessToken = jwtService.issueAccessToken(member);
        String refreshToken = jwtService.issueRefreshToken(member);
        JwtResponse body = new JwtResponse(accessToken, refreshToken);
        httpService.sendResponseBody(response, HttpStatus.OK.value(), body);
    }
}
