package com.excelr.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.excelr.model.Doctor;
import com.excelr.model.Staff;
import com.excelr.model.User;
import com.excelr.repo.DoctorRepo;
import com.excelr.repo.StaffRepository;
import com.excelr.repo.UserRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private StaffRepository staffRepository;
    
    @Autowired
    private DoctorRepo doctorRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Try to find user in User, Staff, or Doctor repositories
            Optional<User> userDetails = userRepo.findByEmail(email);
            Optional<Staff> staffDetails = staffRepository.findByEmail(email);
            Optional<Doctor> doctorDetails = doctorRepo.findByEmail(email);

            Object authenticatedUser = null;
            String role = null;

            if (userDetails.isPresent() && jwtUtil.validateToken(token, email)) {
                authenticatedUser = userDetails.get();
                role = userDetails.get().getRole().name(); // Get role as String
            } else if (staffDetails.isPresent() && jwtUtil.validateToken(token, email)) {
                authenticatedUser = staffDetails.get();
                role = "STAFF"; // Assuming Staff has a fixed role
            } else if (doctorDetails.isPresent() && jwtUtil.validateToken(token, email)) {
                authenticatedUser = doctorDetails.get();
                role = "DOCTOR"; // Assuming Doctor has a fixed role
            }

            if (authenticatedUser != null && role != null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                authenticatedUser,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)) // Ensure correct format
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
