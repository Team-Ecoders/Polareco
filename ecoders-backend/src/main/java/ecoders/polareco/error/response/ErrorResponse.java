package ecoders.polareco.error.response;

import ecoders.polareco.error.exception.ExceptionCode;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ErrorResponse {

    private final String httpStatus;

    private final String message;

    public static ErrorResponse of(ExceptionCode exceptionCode) {
        return new ErrorResponse(exceptionCode.getHttpStatus().toString(), exceptionCode.getMessage());
    }
}
