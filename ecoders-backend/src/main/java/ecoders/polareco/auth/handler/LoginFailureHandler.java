package ecoders.polareco.auth.handler;

import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.response.BusinessLogicErrorResponse;
import ecoders.polareco.http.service.HttpService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@AllArgsConstructor
@Slf4j
public class LoginFailureHandler implements AuthenticationFailureHandler {

    private final HttpService httpService;

    @Override
    public void onAuthenticationFailure(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException exception
    ) throws IOException, ServletException {
        log.error("로그인 실패: {}", exception.toString());
        if (exception instanceof BadCredentialsException) {
            BusinessLogicErrorResponse body = new BusinessLogicErrorResponse(ExceptionCode.LOGIN_FAILED);
            httpService.sendResponseBody(response, HttpStatus.UNAUTHORIZED.value(), body);
        }
    }
}
