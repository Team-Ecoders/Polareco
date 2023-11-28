package ecoders.polareco.security.config;

import ecoders.polareco.auth.filter.JwtVerificationFilter;
import ecoders.polareco.auth.filter.PolarecoLoginFilter;
import ecoders.polareco.auth.handler.LoginFailureHandler;
import ecoders.polareco.auth.handler.LoginSuccessHandler;
import ecoders.polareco.auth.handler.LogoutHandler;
import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.http.service.HttpService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    @Value("${client-url}")
    private String clientUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity builder,
        HttpService httpService,
        JwtService jwtService
    ) throws Exception {
        return builder
            .headers().frameOptions().sameOrigin()
            .and().csrf().disable()
            .formLogin().disable()
            .httpBasic().disable()
            .cors(Customizer.withDefaults())
            .logout().logoutSuccessHandler(new LogoutHandler())
            .and().authorizeHttpRequests(registry -> {
                registry
                    .antMatchers(HttpMethod.GET, "/member/my-info").authenticated()
                    .anyRequest().permitAll();
            })
            .apply(new CustomFilterConfigurer(httpService, jwtService))
            .and().build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of(clientUrl));
        corsConfiguration.setAllowedMethods(List.of("POST", "GET", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource corsConfigurationSource = new UrlBasedCorsConfigurationSource();
        corsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @AllArgsConstructor
    private static class CustomFilterConfigurer extends AbstractHttpConfigurer<CustomFilterConfigurer, HttpSecurity> {

        private final HttpService httpService;

        private final JwtService jwtService;

        @Override
        public void configure(HttpSecurity builder) throws Exception {
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);

            PolarecoLoginFilter polarecoLoginFilter = new PolarecoLoginFilter(httpService, authenticationManager);
            LoginSuccessHandler loginSuccessHandler = new LoginSuccessHandler(jwtService, httpService);
            LoginFailureHandler loginFailureHandler = new LoginFailureHandler(httpService);
            polarecoLoginFilter.setFilterProcessesUrl("/login");
            polarecoLoginFilter.setPostOnly(true);
            polarecoLoginFilter.setAuthenticationSuccessHandler(loginSuccessHandler);
            polarecoLoginFilter.setAuthenticationFailureHandler(loginFailureHandler);
            builder.addFilter(polarecoLoginFilter);

            JwtVerificationFilter jwtVerificationFilter = new JwtVerificationFilter(jwtService, httpService);
            builder.addFilterAfter(jwtVerificationFilter, PolarecoLoginFilter.class);
        }
    }
}
