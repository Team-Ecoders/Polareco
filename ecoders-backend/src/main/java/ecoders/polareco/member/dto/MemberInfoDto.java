package ecoders.polareco.member.dto;

import ecoders.polareco.member.entity.Member;
import lombok.Getter;

import java.util.UUID;

@Getter
public class MemberInfoDto {

    private final UUID uuid;

    private final String email;

    private final String username;

    private final String profileImage;

    public MemberInfoDto(Member member) {
        this.uuid = member.getUuid();
        this.email = member.getEmail();
        this.username = member.getUsername();
        this.profileImage = member.getProfileImage();
    }
}
