package ecoders.polareco.auth.user;

import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.repository.MemberRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class PolarecoUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            String message = "이메일 주소에 해당하는 회원이 존재하지 않음: " + email;
            log.error(message);
            throw new UsernameNotFoundException(message);
        }
        log.info("PolarecoUserDetails 객체 생성 완료");
        return new PolarecoUserDetails(member);
    }
}
