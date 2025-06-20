package com.excelr.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
	Optional<Staff> findByUsername(String username);

	Optional<Staff> findByEmail(String email);

}
