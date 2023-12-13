package ecoders.polareco.mission.todaymission.dto.response;

import lombok.Getter;

@Getter
public class TodayMissionListResponse {
    private Long todayMissionId;
    private String text;
    private boolean completed;

    public TodayMissionListResponse(Long todayMissionId, String text) {
        this.todayMissionId = todayMissionId;
        this.text = text;
//        this.completed = completed;
    }
}

