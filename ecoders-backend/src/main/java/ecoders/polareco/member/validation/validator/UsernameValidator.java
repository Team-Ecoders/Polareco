package ecoders.polareco.member.validation.validator;

import ecoders.polareco.member.validation.annotation.Username;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UsernameValidator implements ConstraintValidator<Username, String> {

    @Override
    public void initialize(Username constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        String regex = "^[a-zA-Z\\dㄱ-ㅎ가-힣]{2,10}$";
        return value.matches(regex);
    }
}
