package ecoders.polareco.error.advice;

import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.response.BusinessLogicErrorResponse;
import ecoders.polareco.error.response.FieldErrorResponse;
import ecoders.polareco.error.exception.ExceptionCode;
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
    public ResponseEntity<BusinessLogicErrorResponse> handlePolarecoException(BusinessLogicException exception) {
        ExceptionCode exceptionCode = exception.getExceptionCode();
        BusinessLogicErrorResponse businessLogicErrorResponseDto = new BusinessLogicErrorResponse(exceptionCode);
        return ResponseEntity.status(exceptionCode.getHttpStatus()).body(businessLogicErrorResponseDto);
    }

    @ExceptionHandler
    public ResponseEntity<FieldErrorResponse> handleMethodArgumentNotValidException(
        MethodArgumentNotValidException exception
    ) {
        List<FieldError> fieldErrors = exception.getFieldErrors();
        FieldErrorResponse fieldErrorResponse = new FieldErrorResponse(fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(fieldErrorResponse);
    }
}
