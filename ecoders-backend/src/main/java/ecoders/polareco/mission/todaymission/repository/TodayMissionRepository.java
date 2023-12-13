package ecoders.polareco.mission.todaymission.repository;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.mission.todaymission.entity.TodayMission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TodayMissionRepository extends JpaRepository<TodayMission, Long> {

    List<TodayMission> findTodayMissionByMember_Uuid(UUID uuid);
}
