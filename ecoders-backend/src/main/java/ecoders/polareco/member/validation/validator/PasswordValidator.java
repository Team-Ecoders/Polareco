package ecoders.polareco.member.validation.validator;

import ecoders.polareco.member.validation.annotation.Password;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<Password, String> {

    @Override
    public void initialize(Password constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        String regex = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[`~!@#$%^&*()\\-_=+\\[\\]{}\\\\|;:'\",.<>/?])"
                       + "[a-zA-Z\\d`~!@#$%^&*()\\-_=+\\[\\]{}\\\\|;:'\",.<>/?]{8,20}$";
        return value.matches(regex);
    }
}
