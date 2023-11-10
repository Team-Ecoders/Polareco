package ecoders.polareco.member.entity;

import ecoders.polareco.auditing.AuditableEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Entity
public class Member extends AuditableEntity {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "binary(16)")
    private UUID uuid;

    @Column(nullable = false, updatable = false)
    private String email;

    @Setter
    @Column(nullable = false)
    private String username;

    @Setter
    @Column(nullable = true)
    private String password;

    public Member(String email, String username) {
        this(email, username, null);
    }

    public Member(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public boolean hasPassword() {
        return password != null;
    }
}
