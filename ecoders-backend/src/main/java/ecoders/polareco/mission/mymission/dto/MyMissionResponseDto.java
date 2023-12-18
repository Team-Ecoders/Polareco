package ecoders.polareco.mission.mymission.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class MyMissionResponseDto {

    private Long missionId;
    private String text;
    private Boolean completed;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime completedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime modifiedAt;

    public MyMissionResponseDto(Long missionId, String text, Boolean completed, LocalDateTime completedAt, LocalDateTime createdAt, LocalDateTime modifiedAt) {
        this.missionId = getMissionId();
        this.text = text;
        this.completed = completed;
        if (completed) {
            this.completedAt = completedAt;
        } else {
            this.completedAt = null;
        }
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
}
