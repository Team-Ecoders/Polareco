package ecoders.polareco.member.validation.annotation;

import ecoders.polareco.member.validation.validator.EmailVerificationCodeValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = { EmailVerificationCodeValidator.class })
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD })
public @interface EmailVerificationCode {

    String message() default "이메일 인증 코드는 알파벳과 숫자로 구성된 6자의 문자열입니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
