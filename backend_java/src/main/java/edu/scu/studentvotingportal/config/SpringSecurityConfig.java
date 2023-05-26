package edu.scu.studentvotingportal.config;

import edu.scu.studentvotingportal.filter.JwtAuthenticationFilter;
import edu.scu.studentvotingportal.handler.CustomAccessDeniedHandler;
import edu.scu.studentvotingportal.handler.CustomAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SpringSecurityConfig {

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    CustomAccessDeniedHandler customAccessDeniedHandler;


    private static final String[] AUTH_WHITELIST = {
        // Spring boot
        "/resources/**",
        "/error",
        // -- Swagger UI v2
        "/v2/api-docs",
        "/swagger-resources",
        "/swagger-resources/**",
        "/configuration/ui",
        "/configuration/security",
        "/swagger-ui.html",
        "/webjars/**",
        // -- Swagger UI v3 (OpenAPI)
        "/v3/api-docs/**",
        "/swagger-ui/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(AUTH_WHITELIST).permitAll()
                .requestMatchers(
                    HttpMethod.GET,
                    "/university/**",
                    "/elections/**",
                    "/positions/**",
                    "/candidates/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/authentication/", "/users/").permitAll()
                .requestMatchers("/me/", "/users/**").authenticated()
                .requestMatchers("/votes/").hasAuthority("USER")
                .requestMatchers(HttpMethod.DELETE, "/authentication/").authenticated()
                .requestMatchers(
                    "/elections/**",
                    "/positions/**",
                    "/candidates/**").hasAuthority("ADMIN")
                .requestMatchers("/university/**").hasAuthority("SUPERUSER")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().denyAll()
            )
            .exceptionHandling(customizer -> customizer
                .authenticationEntryPoint(customAuthenticationEntryPoint)
                .accessDeniedHandler(customAccessDeniedHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .cors().and()
            .csrf().disable()
            // Not getting `SecurityContext` via `Session`
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
