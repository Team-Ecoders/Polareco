package ecoders.polareco.mission.todaymission.entity;

import ecoders.polareco.auditing.AuditableEntity;
import ecoders.polareco.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Builder
@Entity
public class TodayMission extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    private Member member;

    private Boolean completed;
    private LocalDateTime completedAt;

    public TodayMission() {
    }

    public TodayMission(Long id, String content, Member member, Boolean completed, LocalDateTime completedAt) {
        this.id = id;
        this.content = content;
        this.member = member;
        this.completed = completed;
        this.completedAt = completedAt;
    }
}
