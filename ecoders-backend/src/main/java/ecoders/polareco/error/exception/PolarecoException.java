package ecoders.polareco.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class PolarecoException extends RuntimeException {

    private final ExceptionCode exceptionCode;
}
