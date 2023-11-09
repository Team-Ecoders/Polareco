package ecoders.polareco.member.validation.annotation;

import ecoders.polareco.member.validation.validator.UsernameValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = { UsernameValidator.class})
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD})
public @interface Username {

    String message() default "닉네임은 한글, 알파벳, 공백으로 구성된 2~10자의 문자열이어야 합니다. 단, 공백으로 시작하거나 끝날 수 없습니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
