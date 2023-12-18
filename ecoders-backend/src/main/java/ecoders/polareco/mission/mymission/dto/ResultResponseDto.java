package ecoders.polareco.mission.mymission.dto;

import lombok.Getter;

@Getter
public class ResultResponseDto {
    private String result;
    private String message;

    public ResultResponseDto(String result, String message) {
        this.result = result;
        this.message = message;
    }
}
