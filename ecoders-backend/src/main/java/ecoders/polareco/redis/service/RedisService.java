package ecoders.polareco.redis.service;

import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.exception.BusinessLogicException;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@AllArgsConstructor
@Transactional
@Service
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisTemplate<String, String> stringRedisTemplate;

    public void saveEmailVerificationCode(String email, String verificationCode) {
        String key = keyForEmailVerification(email);
        redisTemplate.opsForValue().set(key, verificationCode, 3, TimeUnit.MINUTES);
    }

    public String getEmailVerificationCode(String email) {
        String key = keyForEmailVerification(email);
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            throw new BusinessLogicException(ExceptionCode.EMAIL_VERIFICATION_CODE_NOT_FOUND);
        }
        return (String) value;
    }

    public void deleteEmailVerificationCode(String email) {
        String key = keyForEmailVerification(email);
        redisTemplate.delete(key);
    }

    public void saveRefreshToken(String email, String refreshToken, long timeout) {
        String key = keyForRefreshToken(email);
        redisTemplate.opsForValue().set(key, refreshToken, timeout, TimeUnit.HOURS);
    }

    public String getRefreshToken(String email) {
        String key = keyForRefreshToken(email);
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            throw new BusinessLogicException(ExceptionCode.REFRESH_TOKEN_NOT_FOUND);
        }
        return (String) value;
    }

    private String keyForEmailVerification(String email) {
        return "verification:email:" + email;
    }

    private String keyForRefreshToken(String email) {
        return "refreshtoken:" + email;
    }

    public String getData(String key) {
        ValueOperations<String, String> valueOperations = stringRedisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    public void setDateExpire(String key, String value, long duration) {
        ValueOperations<String, String> valueOperations = stringRedisTemplate.opsForValue();
        Duration expireDuration = Duration.ofSeconds(duration);
        valueOperations.set(key, value, expireDuration);
    }
}
