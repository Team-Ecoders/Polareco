package ecoders.polareco.mission.todaymission.service;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.mission.todaymission.dto.response.TodayMissionListResponse;
import ecoders.polareco.mission.todaymission.entity.Mission;
import ecoders.polareco.mission.todaymission.entity.TodayMission;
import ecoders.polareco.mission.todaymission.repository.MissionsRepository;
import ecoders.polareco.mission.todaymission.repository.TodayMissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TodayMissionService {

    private final MissionsRepository missionsRepository;
    private final TodayMissionRepository todayMissionRepository;
    private final MemberService memberService;

    public TodayMissionService(MissionsRepository missionsRepository, TodayMissionRepository todayMissionRepository, MemberService memberService) {
        this.missionsRepository = missionsRepository;
        this.todayMissionRepository = todayMissionRepository;
        this.memberService = memberService;
    }

    /**
     * 오늘의 미션 가져오기
     */
    @Transactional
    public List<TodayMissionListResponse> getTodayMissions(UUID uuid) {

        List<Mission> randomMissions = missionsRepository.findRandomMissions();

        return randomMissions
                .stream()
                .map(mission -> new TodayMissionListResponse(
                        mission.getId(),
                        mission.getContent()
                )).collect(Collectors.toList());

    }


//    @Transactional
//    public List<TodayMissionListResponse> getTodayMissions(UUID uuid, int count) {
//
//        List<TodayMission> list = todayMissionRepository.findAll();
//
//        if (list.isEmpty()) {
//            List<Long> todayMissionIds = getTodayMissionId(count);
//            for (Long missionId : todayMissionIds) {
//                todayMissionRepository.save(TodayMission.builder()
//                        .content("mission")
//                        .completed(false)
//                        .id(missionId)
//                        .build());
//            }
//        }
//
//        return list
//                .stream()
//                .map(mission -> new TodayMissionListResponse(
//                        mission.getId(),
//                        mission.getContent(),
//                        mission.getCompleted()
//                )).collect(Collectors.toList());
//    }

//    /**
//     * 오늘의 미션 id 랜덤으로 가져오기 위한 메서드
//     */
//    @Transactional
//    public List<Long> getTodayMissionId(int count) {
//        try {
//            LocalDateTime now = LocalDateTime.now();
//            List<TodayMission> missionIdList = missionsRepository.findAll();
//            List<Long> todayMissionsId = new ArrayList<>();
//
//            Random random = new Random(now.getDayOfYear());
//
//            for (int i = 0; i < count; i++) {
//                if (!missionIdList.isEmpty()) {
//                    int id = random.nextInt(missionIdList.size());
//                    while (todayMissionsId.contains(missionIdList.get(id).getId())) {
//                        id = random.nextInt(missionIdList.size());
//                    }
//                    todayMissionsId.add(missionIdList.get(id).getId());
//                }
//            }
//            return todayMissionsId;
//        } catch (Exception e) {
//            throw new RuntimeException("데이터베이스 오류");
//        }
//    }
}
