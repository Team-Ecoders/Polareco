package ecoders.polareco.auth.filter;

import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.response.BusinessLogicErrorResponse;
import ecoders.polareco.http.service.HttpService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@AllArgsConstructor
@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final HttpService httpService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        try {
            // 액세스 토큰 검증에 성공하면 인증 토큰을 생성하여 컨텍스트에 저장한다.
            String accessToken = jwtService.removeBearerPrefix(request.getHeader(HttpHeaders.AUTHORIZATION));
            Claims claims = jwtService.getClaimsFromToken(accessToken);
            setAuthenticationToSecurityContext(claims);
        } catch (BusinessLogicException businessLogicException) {
            // 액세스 토큰 검증에 실패하면 에러 응답을 보낸다.
            ExceptionCode exceptionCode = businessLogicException.getExceptionCode();
            int statusCode = exceptionCode.getHttpStatus().value();
            BusinessLogicErrorResponse body = new BusinessLogicErrorResponse(exceptionCode);
            httpService.sendResponse(response, statusCode, body);
            return;
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Authorization 헤더가 없거나 "Bearer "로 시작하지 않으면 필터가 동작하지 않는다.
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        return authorizationHeader == null || !authorizationHeader.startsWith("Bearer ");
    }

    private void setAuthenticationToSecurityContext(Claims claims) {
        // 액세스 토큰의 클레임을 기반으로 Authentication 객체를 생성하여 SecurityContext에 저장한다.
        String email = claims.get("email", String.class);
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
