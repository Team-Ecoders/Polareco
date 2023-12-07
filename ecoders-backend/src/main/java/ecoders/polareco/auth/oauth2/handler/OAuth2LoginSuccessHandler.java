package ecoders.polareco.auth.oauth2.handler;

import ecoders.polareco.auth.jwt.response.JwtResponse;
import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.http.service.HttpService;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.repository.MemberRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@AllArgsConstructor
@Component
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    private final HttpService httpService;

    private final MemberRepository memberRepository;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        // 인증 성공한 Google 사용자 정보 획득
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        // 이메일 주소에 해당하는 데이터를 조회한 결과에 따라 그대로 사용하거나 새로 생성 및 저장
        String email = (String) attributes.get("email");
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            String username = (String) attributes.get("name");
            String profileImage = (String) attributes.get("picture");
            Member createdMember = new Member(email, username);
            createdMember.setProfileImage(profileImage);
            memberRepository.save(createdMember);
            member = createdMember;
        }
        // 회원 데이터를 가지고 JWT 토큰 발급한 뒤 클라이언트에게 응답으로 반환
        Authentication authenticationToken = new UsernamePasswordAuthenticationToken(email, null, null);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        String accessToken = jwtService.issueAccessToken(member);
        String refreshToken = jwtService.issueRefreshToken(member);
        JwtResponse jwtResponse = new JwtResponse(accessToken, refreshToken);
        httpService.sendResponse(response, HttpStatus.OK.value(), jwtResponse);
    }
}
