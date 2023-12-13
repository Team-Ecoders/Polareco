package ecoders.polareco.mission.mymission.controller;

import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.mission.mymission.dto.MyMissionResponseDto;
import ecoders.polareco.mission.mymission.dto.ResultResponseDto;
import ecoders.polareco.mission.mymission.dto.request.MyMissionRequestDto;
import ecoders.polareco.mission.mymission.repository.MyMissionRepository;
import ecoders.polareco.mission.mymission.service.MyMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mission")
public class MyMissionController {

    private final JwtService jwtService;
    private final MyMissionService myMissionService;
    private final MemberService memberService;

    @Autowired
    public MyMissionController(JwtService jwtService, MyMissionService myMissionService, MemberService memberService) {
        this.jwtService = jwtService;
        this.myMissionService = myMissionService;
        this.memberService = memberService;
    }

    public static MyMissionRepository myMissionRepository;


    /**
     * 나만의 미션 전체 조회 API
     */
    @GetMapping("/my_missions")
    public ResponseEntity<List<MyMissionResponseDto>> getMissions (
            @AuthenticationPrincipal String email
    ) {
        List<MyMissionResponseDto> missions = myMissionService.getMissions(email);

        return new ResponseEntity<>(missions, HttpStatus.OK);
    }

    /**
     * 나만의 미션 생성 API
     */
    @PostMapping("/my_mission")
    public ResponseEntity<ResultResponseDto> createMission(
            @RequestBody MyMissionRequestDto.Post requestDto,
            @AuthenticationPrincipal String email
    ) {

        myMissionService.createMission(requestDto, email);

        ResultResponseDto responseDto = new ResultResponseDto("Success", "나만의 미션 등록에 성공하였습니다.");
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 나만의 미션 수정 API
     */
    @PatchMapping("/my_mission/{missionId}")
    public ResponseEntity<ResultResponseDto> updateMission(
            @PathVariable Long missionId,
            @RequestBody MyMissionRequestDto.Patch requestDto,
            @AuthenticationPrincipal String email
    ) {
        myMissionService.updateMission(missionId, requestDto, email);

        ResultResponseDto responseDto = new ResultResponseDto("Success", "나만의 미션 수정에 성공하였습니다.");
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 나만의 미션 삭제 API
     */
    @DeleteMapping("/my_mission/{missionId}")
    public ResponseEntity<ResultResponseDto> deleteMission(
            @PathVariable Long missionId,
            @AuthenticationPrincipal String email
    ) {
        myMissionService.deleteMission(missionId, email);

        ResultResponseDto responseDto = new ResultResponseDto("success", "나만의 미션 삭제 성공하였습니다.");

        return ResponseEntity.ok(responseDto);
    }



}
