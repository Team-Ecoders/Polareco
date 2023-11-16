package ecoders.polareco.auth.jwt.service;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.redis.service.RedisService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    private final long accessTokenExpirationHours;

    private final long refreshTokenExpirationHours;

    private final SecretKey secretKey;

    private final RedisService redisService;

    public JwtService(
        @Value("${jwt.access-token-expiration-hours}") long accessTokenExpirationHours,
        @Value("${jwt.refresh-token-expiration-hours}") long refreshTokenExpirationHours,
        @Value("${jwt.secret-key}") String secretKey,
        RedisService redisService
    ) {
        this.accessTokenExpirationHours = accessTokenExpirationHours;
        this.refreshTokenExpirationHours = refreshTokenExpirationHours;
        String base64EncodedSecretKey = Encoders.BASE64.encode(secretKey.getBytes());
        this.secretKey = Keys.hmacShaKeyFor(base64EncodedSecretKey.getBytes());
        this.redisService = redisService;
    }

    public String issueAccessToken(Member member) {
        String accessToken = issueToken(member, accessTokenExpirationHours);
        log.info("액세스 토큰 발급");
        return accessToken;
    }

    public String issueRefreshToken(Member member) {
        String refreshToken = issueToken(member, refreshTokenExpirationHours);
        log.info("리프레시 토큰 발급");
        redisService.saveRefreshToken(member.getEmail(), refreshToken, refreshTokenExpirationHours);
        log.info("Redis에 리프레시 토큰 저장");
        return refreshToken;
    }

    private String issueToken(Member member, long expirationHours) {
        return "Bearer " + Jwts.builder()
            .subject(member.getUuid().toString())
            .claim("email", member.getEmail())
            .claim("username", member.getUsername())
            .expiration(new Date(System.currentTimeMillis() + expirationHours * 360_0000L))
            .issuer("Polareco")
            .issuedAt(new Date())
            .signWith(secretKey)
            .compact();
    }
}
