package ecoders.polareco.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@AllArgsConstructor
@Getter
public enum ExceptionCode {

    MEMBER_ALREADY_EXISTS(FORBIDDEN, "Member already exists"),
    EMAIL_VERIFICATION_CODE_NOT_FOUND(NOT_FOUND, "Email verification code not found"),
    EMAIL_VERIFICATION_CODE_MISMATCH(UNAUTHORIZED, "Email verification code mismatch");

    private final HttpStatus httpStatus;

    private final String message;
}
