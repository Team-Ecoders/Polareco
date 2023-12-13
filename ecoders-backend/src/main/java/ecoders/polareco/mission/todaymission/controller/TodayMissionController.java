package ecoders.polareco.mission.todaymission.controller;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.mission.todaymission.dto.response.TodayMissionListResponse;
import ecoders.polareco.mission.todaymission.entity.Mission;
import ecoders.polareco.mission.todaymission.service.TodayMissionService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/mission")
@RequiredArgsConstructor
public class TodayMissionController {

    private final MemberService memberService;
    private final TodayMissionService todayMissionService;

    @GetMapping("/today_mission")
    public ResponseEntity<?> getRandomMission(
            @AuthenticationPrincipal String email
    ) {
        Member member = memberService.findMemberByEmail(email);
        UUID uuid = member.getUuid();

        List<TodayMissionListResponse> todayMissions = todayMissionService.getTodayMissions(uuid);

        return ResponseEntity.ok().body(todayMissions);
    }

//    /**
//     * 오늘의 미션 Get API
//     */
//    @GetMapping("/today_mission")
//    public ResponseEntity<?> getTodayMissionList(
//            @RequestParam(defaultValue = "5", name = "count") int count,
//            @AuthenticationPrincipal String email
//    ) {
//        Member member = memberService.findMemberByEmail(email);
//        UUID uuid = member.getUuid();
//
//        List<TodayMissionListResponse> missionListResponses = todayMissionService.getTodayMissions(uuid, count);
//
//        return ResponseEntity.ok().body(missionListResponses);
//    }
}
