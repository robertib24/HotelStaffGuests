package com.example.hotelservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/staff/auth/**").permitAll()
                        .requestMatchers("/api/client/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/rooms").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/{id}").permitAll()

                        .requestMatchers("/api/dashboard/**").authenticated()

                        .requestMatchers("/api/employees/**").hasAuthority("ROLE_Admin")
                        .requestMatchers("/api/reports/**").hasAuthority("ROLE_Admin")

                        .requestMatchers(HttpMethod.PUT, "/api/rooms/{id}/status").hasAnyAuthority("ROLE_Admin", "ROLE_Manager", "ROLE_Cleaner")
                        .requestMatchers(HttpMethod.GET, "/api/rooms/status/**").hasAnyAuthority("ROLE_Admin", "ROLE_Manager", "ROLE_Cleaner")

                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").hasAnyAuthority("ROLE_Admin", "ROLE_Manager", "ROLE_Receptionist", "ROLE_Cleaner")
                        .requestMatchers("/api/rooms/**").hasAnyAuthority("ROLE_Admin", "ROLE_Manager")

                        .requestMatchers("/api/guests/**").hasAnyAuthority("ROLE_Admin", "ROLE_Manager", "ROLE_Receptionist")
                        .requestMatchers("/api/reservations/**").hasAnyAuthority("ROLE_Admin", "ROLE_Manager", "ROLE_Receptionist")

                        .requestMatchers("/api/client/my-reservations").hasAuthority("ROLE_GUEST")
                        .requestMatchers("/api/client/reservations").hasAuthority("ROLE_GUEST")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}