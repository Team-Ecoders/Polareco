package ecoders.polareco.auth.filter;

import ecoders.polareco.auth.dto.LoginDto;
import ecoders.polareco.http.service.HttpService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@AllArgsConstructor
@Slf4j
public class PolarecoLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final HttpService httpService;

    private final AuthenticationManager authenticationManager;

    @Override
    @SneakyThrows
    public Authentication attemptAuthentication(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws AuthenticationException {
        LoginDto loginDto = httpService.readRequestBody(request, LoginDto.class);
        Authentication authenticationToken = new UsernamePasswordAuthenticationToken(loginDto.getEmail(),
            loginDto.getPassword());
        log.info("인증 토큰 생성 완료");
        return authenticationManager.authenticate(authenticationToken);
    }
}
