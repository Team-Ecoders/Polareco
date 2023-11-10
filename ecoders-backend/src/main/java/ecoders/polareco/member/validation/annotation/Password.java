package ecoders.polareco.member.validation.annotation;

import ecoders.polareco.member.validation.validator.PasswordValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = { PasswordValidator.class })
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD })
public @interface Password {

    String message() default "비밀번호는 알파벳, 숫자, 특수문자로 구성된 8~20자의 문자열이어야 합니다.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
