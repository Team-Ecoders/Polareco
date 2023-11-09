package ecoders.polareco.member.validation.validator;

import ecoders.polareco.member.validation.annotation.EmailVerificationCode;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class EmailVerificationCodeValidator implements ConstraintValidator<EmailVerificationCode, String> {

    @Override
    public void initialize(EmailVerificationCode constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        String regex = "^[a-z\\d]{6}$";
        return value.toLowerCase().matches(regex);
    }
}
