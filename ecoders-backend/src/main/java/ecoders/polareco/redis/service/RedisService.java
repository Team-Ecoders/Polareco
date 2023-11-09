package ecoders.polareco.redis.service;

import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.exception.PolarecoException;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@AllArgsConstructor
@Transactional
@Service
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveEmailVerificationCode(String email, String verificationCode) {
        String key = keyForEmailVerification(email);
        redisTemplate.opsForValue().set(key, verificationCode, 3, TimeUnit.MINUTES);
    }

    public String getEmailVerificationCode(String email) {
        String key = keyForEmailVerification(email);
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            throw new PolarecoException(ExceptionCode.EMAIL_VERIFICATION_CODE_NOT_FOUND);
        }
        return (String) value;
    }

    public void deleteEmailVerificationCode(String email) {
        String key = keyForEmailVerification(email);
        redisTemplate.delete(key);
    }

    private String keyForEmailVerification(String email) {
        return "verification:email:" + email;
    }
}
