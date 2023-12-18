package ecoders.polareco.mission.todaymission.entity;

import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
public class Missions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    public Missions() {
    }

    public Missions(Long id, String content) {
        this.id = id;
        this.content = content;
    }
}
