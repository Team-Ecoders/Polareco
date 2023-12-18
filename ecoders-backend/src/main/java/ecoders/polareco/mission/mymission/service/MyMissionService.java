package ecoders.polareco.mission.mymission.service;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.repository.MemberRepository;
import ecoders.polareco.mission.mymission.dto.MyMissionResponseDto;
import ecoders.polareco.mission.mymission.dto.request.MyMissionRequestDto;
import ecoders.polareco.mission.mymission.entity.MyMission;
import ecoders.polareco.mission.mymission.repository.MyMissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyMissionService {

    private final MemberRepository memberRepository;
    private final MyMissionRepository myMissionRepository;

    /**
     * 나만의 미션 전체 조회
     */
    public List<MyMissionResponseDto> getMissions(String email) {
        Member member = memberRepository.findByEmail(email);

        List<MyMission> missions = myMissionRepository.findMyMissionsByMember(member);

        return missions
                .stream()
                .map(mission -> new MyMissionResponseDto(
                        mission.getId(),
                        mission.getText(),
                        mission.getCompleted(),
                        mission.getCreatedAt(),
                        mission.getModifiedAt(),
                        mission.getCompletedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 나만의 미션 생성
     */
    @Transactional
    public void createMission(MyMissionRequestDto.Post requestDto, String email) {

        Member member = memberRepository.findByEmail(email);

        MyMission myMission = new MyMission();
        myMission.setText(requestDto.getText());
        myMission.setCompleted(false);
        myMission.setMember(member);

        myMissionRepository.save(myMission);
    }

    /**
     * 나만의 미션 수정
     */
    public void updateMission(Long myMissionId, MyMissionRequestDto.Patch requestDto, String email) {

        Member member = memberRepository.findByEmail(email);

        MyMission myMission = myMissionRepository.findByIdAndMember(myMissionId, member);

        myMission.setText(requestDto.getText());
        myMission.setCompleted(requestDto.isCompleted());
        myMission.setCompletedAt(LocalDateTime.now());

        myMissionRepository.save(myMission);
    }


    /**
     * 나만의 미션 삭제
     */
    public void deleteMission(Long myMissionId, String email) {

        Member member = memberRepository.findByEmail(email);

        MyMission myMission = myMissionRepository.findByIdAndMember(myMissionId, member);

        myMissionRepository.delete(myMission);
    }

}
