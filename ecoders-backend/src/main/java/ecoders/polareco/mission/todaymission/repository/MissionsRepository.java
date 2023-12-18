package ecoders.polareco.mission.todaymission.repository;

import ecoders.polareco.mission.todaymission.entity.Missions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MissionsRepository extends JpaRepository<Missions, Long> {

}
