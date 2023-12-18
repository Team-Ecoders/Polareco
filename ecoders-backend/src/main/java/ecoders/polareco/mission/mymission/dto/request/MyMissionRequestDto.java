package ecoders.polareco.mission.mymission.dto.request;

import lombok.Getter;

public class MyMissionRequestDto {

    @Getter
    public static class Post {
        private String text;
        private Boolean completed;
    }

    @Getter
    public static class Patch {
        private Long missionId;
        private String text;
        private boolean completed;
    }

}
