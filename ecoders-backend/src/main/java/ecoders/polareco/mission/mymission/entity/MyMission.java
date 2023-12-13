package ecoders.polareco.mission.mymission.entity;

import ecoders.polareco.auditing.AuditableEntity;
import ecoders.polareco.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class MyMission extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @ManyToOne
    private Member member;

    @ColumnDefault("false")
    private Boolean completed;

    private LocalDateTime completedAt;

    /**
     * 나만의 미션 생성시 사용
     */
    public MyMission(String text, Boolean completed) {
        this.text = text;
        this.completed = completed;
        if (completed) {
            this.completedAt = LocalDateTime.now();
        } else {
            this.completedAt = null;
        };
    }
}
