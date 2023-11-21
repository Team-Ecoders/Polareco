package ecoders.polareco.auth.jwt.service;

import ecoders.polareco.auth.jwt.response.JwtResponse;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.redis.service.RedisService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.util.Date;

@RequiredArgsConstructor
@Service
@Slf4j
public class JwtService {

    @Value("${jwt.access-token-expiration-hours}")
    private long accessTokenExpirationHours;

    @Value("${jwt.refresh-token-expiration-hours}")
    private long refreshTokenExpirationHours;

    @Value("${jwt.secret-key}")
    private String secretKey;

    private final RedisService redisService;

    private final MemberService memberService;

    public String issueAccessToken(Member member) {
        String accessToken = issueToken(member, accessTokenExpirationHours);
        log.info("액세스 토큰 발급 완료");
        return accessToken;
    }

    public String issueRefreshToken(Member member) {
        String refreshToken = issueToken(member, refreshTokenExpirationHours);
        redisService.saveRefreshToken(member.getEmail(), refreshToken, refreshTokenExpirationHours);
        log.info("리프레시 토큰 발급 및 Redis에 저장 완료");
        return refreshToken;
    }

    @Transactional
    public JwtResponse reissueTokens(String bearerRefreshToken) {
        // 헤더에 있던 리프레시 토큰의 클레임에서 이메일 주소를 가져온다.
        String refreshToken = removeBearerPrefix(bearerRefreshToken);
        Claims claims = getClaimsFromToken(refreshToken);
        String email = claims.get("email", String.class);
        // Redis에 이메일 주소와 매핑된 리프레시 토큰을 가져와 비교한다.
        checkRefreshTokenInRedis(email, bearerRefreshToken);
        // 이메일 주소에 해당하는 회원 정보를 기반으로 액세스 및 리프레시 토큰을 새로 발급한다.
        Member member = memberService.findMemberByEmail(email);
        String reissuedAccessToken = issueAccessToken(member);
        String reissuedRefreshToken = issueRefreshToken(member);
        return new JwtResponse(reissuedAccessToken, reissuedRefreshToken);
    }

    public String removeBearerPrefix(String bearerToken) {
        return bearerToken.replace("Bearer ", "");
    }

    public Claims getClaimsFromToken(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder().setSigningKey(secretKey()).build();
            return parser.parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException expiredJwtException) {
            throw new BusinessLogicException(ExceptionCode.JWT_EXPIRED);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new BusinessLogicException(ExceptionCode.JWT_INVALID);
        }
    }

    public void checkRefreshTokenInRedis(String email, String refreshToken) {
        String savedRefreshToken = redisService.getRefreshToken(email);
        if (!savedRefreshToken.equals(refreshToken)) {
            throw new BusinessLogicException(ExceptionCode.REFRESH_TOKEN_INVALID);
        }
    }

    private SecretKey secretKey() {
        String base64EncodedSecretKey = Encoders.BASE64.encode(secretKey.getBytes());
        return Keys.hmacShaKeyFor(base64EncodedSecretKey.getBytes());
    }

    private String issueToken(Member member, long expirationHours) {
        return "Bearer " + Jwts.builder()
            .setSubject(member.getUuid().toString())
            .claim("email", member.getEmail())
            .claim("username", member.getUsername())
            .setExpiration(new Date(System.currentTimeMillis() + expirationHours * 360_0000L))
            .setIssuer("Polareco")
            .setIssuedAt(new Date())
            .signWith(secretKey())
            .compact();
    }
}
