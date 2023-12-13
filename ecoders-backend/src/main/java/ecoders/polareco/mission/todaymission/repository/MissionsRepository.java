package ecoders.polareco.mission.todaymission.repository;

import ecoders.polareco.mission.todaymission.entity.Mission;
import ecoders.polareco.mission.todaymission.entity.TodayMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MissionsRepository extends JpaRepository<TodayMission, Long> {

    @Query(value = "SELECT * FROM missions ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Mission> findRandomMissions();
}
