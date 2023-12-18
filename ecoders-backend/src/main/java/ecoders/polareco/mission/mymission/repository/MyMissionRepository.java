package ecoders.polareco.mission.mymission.repository;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.mission.mymission.entity.MyMission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyMissionRepository extends JpaRepository<MyMission, Long> {

    MyMission findByIdAndMember(Long myMissionId, Member member);

    List<MyMission> findMyMissionsByMember(Member member);
}
