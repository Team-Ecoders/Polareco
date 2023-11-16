package ecoders.polareco.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BusinessLogicException extends RuntimeException {

    private final ExceptionCode exceptionCode;
}
