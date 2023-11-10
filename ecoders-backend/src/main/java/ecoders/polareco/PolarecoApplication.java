package ecoders.polareco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaAuditing
@SpringBootApplication
public class PolarecoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PolarecoApplication.class, args);
	}
}
