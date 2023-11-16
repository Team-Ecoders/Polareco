package ecoders.polareco.error.response;

import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class FieldErrorResponse {

    private final List<FieldErrorDto> fieldErrors;

    public FieldErrorResponse(List<FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors.stream()
            .map(FieldErrorDto::new)
            .collect(Collectors.toList());
    }

    @Getter
    public static class FieldErrorDto {

        private final String fieldName;

        private final Object rejectedValue;

        private final String message;

        public FieldErrorDto(FieldError fieldError) {
            this.fieldName = fieldError.getField();
            this.rejectedValue = fieldError.getRejectedValue();
            this.message = fieldError.getDefaultMessage();
        }
    }
}
