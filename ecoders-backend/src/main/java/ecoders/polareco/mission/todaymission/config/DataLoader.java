package ecoders.polareco.mission.todaymission.config;

import ecoders.polareco.mission.todaymission.entity.Missions;
import ecoders.polareco.mission.todaymission.repository.MissionsRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataLoader implements ApplicationListener<ApplicationReadyEvent> {

    private final MissionsRepository missionsRepository;

    public DataLoader(MissionsRepository missionsRepository) {
        this.missionsRepository = missionsRepository;
    }

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        //초기 데이터 삽입
        missionsRepository.save(new Missions(1L, "빨래 모아서 세탁하기"));
        missionsRepository.save(new Missions(2L, "여름철 실내 적정 온도 26도 유지하기"));
        missionsRepository.save(new Missions(3L, "사용하지 않는 전자제품 플러그 뽑기"));
        missionsRepository.save(new Missions(4L, "사용하지 않는 조명 소등하기"));
        missionsRepository.save(new Missions(5L, "대중교통 이용하기"));
        missionsRepository.save(new Missions(6L, "가까운 거리 걷기나 달리기"));
        missionsRepository.save(new Missions(7L, "읽지 않는 뉴스레터 구독 취소하기"));
        missionsRepository.save(new Missions(8L, "불필요한 메일 삭제하기"));
        missionsRepository.save(new Missions(9L, "텀블러 사용하기"));
        missionsRepository.save(new Missions(10L, "장바구니 사용하기"));
        missionsRepository.save(new Missions(11L, "화면 밝기 줄이기"));
        missionsRepository.save(new Missions(12L, "영상 자동 재생 끄기"));
        missionsRepository.save(new Missions(13L, "유튜브 시청 시간 줄이고 다른 활동하기"));
        missionsRepository.save(new Missions(14L, "배달보다 포장하기"));
        missionsRepository.save(new Missions(15L, "자가용보다 공공자전거 이용하기"));
        missionsRepository.save(new Missions(16L, "샤워 빨리하기(샤워에 집중)"));
        missionsRepository.save(new Missions(17L, "에어컨 필터 청소하기"));
    }
}
