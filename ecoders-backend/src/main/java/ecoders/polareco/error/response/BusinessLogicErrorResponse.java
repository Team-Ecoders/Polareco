package ecoders.polareco.error.response;

import ecoders.polareco.error.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class BusinessLogicErrorResponse {

    private final String httpStatus;

    private final String message;

    public BusinessLogicErrorResponse(ExceptionCode exceptionCode) {
        this.httpStatus = exceptionCode.getHttpStatus().toString();
        this.message = exceptionCode.getMessage();
    }
}
