package com.excelr.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.excelr.model.Doctor;

public interface DoctorRepo  extends JpaRepository<Doctor, Long>{
	@Query("SELECT p FROM Doctor p WHERE " +
		       "p.name LIKE CONCAT('%', :keywords, '%') OR " +
		       "p.specialization LIKE CONCAT('%', :keywords, '%') OR " +
		       "p.qualification LIKE CONCAT('%', :keywords, '%')")
		List<Doctor> searchDoctors(@Param("keywords") String keywords);

	Optional<Doctor> findByEmail(String email);
	Optional<Doctor> findByName(String name);
    List<Doctor> findBySpecialization(String specialization);
	

}
