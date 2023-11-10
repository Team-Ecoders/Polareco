package ecoders.polareco.error.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ConstraintErrorResponse {

    private List<ConstraintError> constraintErrors;

    public static ConstraintErrorResponse of(List<FieldError> fieldErrors) {
        List<ConstraintError> constraintErrors = fieldErrors.stream()
            .map(ConstraintError::of)
            .collect(Collectors.toList());
        return new ConstraintErrorResponse(constraintErrors);
    }

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Getter
    public static class ConstraintError {

        private String fieldName;

        private Object rejectedValue;

        private String message;

        public static ConstraintError of(FieldError fieldError) {
            String fieldName = fieldError.getField();
            Object rejectedValue = fieldError.getRejectedValue();
            String message = fieldError.getDefaultMessage();
            return new ConstraintError(fieldName, rejectedValue, message);
        }
    }
}
