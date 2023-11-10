package ecoders.polareco.error.handler;

import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.error.exception.PolarecoException;
import ecoders.polareco.error.response.ConstraintErrorResponse;
import ecoders.polareco.error.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionAdvice {

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handlePolarecoException(PolarecoException exception) {
        ExceptionCode exceptionCode = exception.getExceptionCode();
        ErrorResponse errorResponse = ErrorResponse.of(exceptionCode);
        return ResponseEntity.status(exceptionCode.getHttpStatus()).body(errorResponse);
    }

    @ExceptionHandler
    public ResponseEntity<ConstraintErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        List<FieldError> fieldErrors = exception.getFieldErrors();
        ConstraintErrorResponse constraintErrorResponse = ConstraintErrorResponse.of(fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(constraintErrorResponse);
    }
}
