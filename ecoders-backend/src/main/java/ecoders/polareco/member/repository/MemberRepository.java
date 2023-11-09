package ecoders.polareco.member.repository;

import ecoders.polareco.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {

    Member findByEmail(String email);
}
