package com.excelr.security;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {
	
	private final JwtFilter jwtFilter;
	
	public SecurityConfig(JwtFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
			.cors(cors -> cors.configurationSource(corsConfigurationSource())) // Pass the CORS configuration correctly
			.authorizeHttpRequests(auth -> auth
					.requestMatchers("/login","/register").permitAll()
					.requestMatchers("/logout","/verify","/forgetpassword","/verify-reset-otp","/resetpassword","/doctor/register","/staff/register").permitAll()
					.requestMatchers("/all").permitAll()
					.requestMatchers("/staff/**").hasAuthority("ROLE_STAFF")
					.requestMatchers("/user/**").hasAuthority("ROLE_USER")
					.requestMatchers("/doctor").hasAuthority("ROLE_DOCTOR")
					.anyRequest().authenticated()
			)
			.exceptionHandling(exception -> exception
					.accessDeniedHandler((request, response, AccessDeniedException) -> {
						response.setContentType("application/json");
						response.setStatus(HttpServletResponse.SC_FORBIDDEN);
						response.getWriter().write("{\"message\":\"unauthorized access\"}");
					})
			)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
	
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Allow React's origin
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow specific HTTP methods
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Allow specific headers
		configuration.setAllowedHeaders(List.of("*")); // ✅ Allow all headers
	    configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration); // Apply CORS settings to all endpoints
		return source;
	}
}
