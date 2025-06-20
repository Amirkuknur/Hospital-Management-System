package com.excelr.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.excelr.model.Doctor;
import com.excelr.model.Role;
import com.excelr.repo.DoctorRepo;

@Service
public class DoctorService {

	@Autowired
	private DoctorRepo doctorRepo;

	public DoctorService(DoctorRepo doctorRepo) {
		super();
		this.doctorRepo = doctorRepo;
	}
	
	public Doctor registerDoctor(Doctor doctor) {
	    if (doctorRepo.findByEmail(doctor.getEmail()).isPresent()) {
	        throw new RuntimeException("Email already registered");
	    }

	    Doctor doctor1 = new Doctor();
	    doctor1.setName(doctor.getName());
	    doctor1.setEmail(doctor.getEmail());
	    doctor1.setPassword(doctor.getPassword());
	    doctor1.setPhone_number(doctor.getPhone_number());
	    doctor1.setSpecialization(doctor.getSpecialization());
	    doctor1.setQualification(doctor.getQualification());
	    doctor1.setExperience(doctor.getExperience());
	    doctor1.setWorkingHours(doctor.getWorkingHours());
	    doctor1.setImage(doctor.getImage());
	    doctor1.setAvailable(true);

	    // Ensure role is set correctly
	    doctor1.setRole(Role.DOCTOR);  // Assuming 'role' is a field in Doctor entity

	    return doctorRepo.save(doctor1);
	}

	
	public Doctor updateDoctor(Long id, Doctor doctorUpdates) {
	    // Find the existing doctor by ID
	    Doctor existingDoctor = doctorRepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("Doctor not found"));

	    // Check if new email is already used by another doctor (if the email is provided)
	    if (doctorUpdates.getEmail() != null) {
	        Optional<Doctor> existingEmailDoctor = doctorRepo.findByEmail(doctorUpdates.getEmail());
	        if (existingEmailDoctor.isPresent() && !existingEmailDoctor.get().getId().equals(id)) {
	            throw new RuntimeException("Email already in use");
	        }
	    }

	    // Overwrite all fields (replace old values with the new ones, including nulls)
	    existingDoctor.setName(doctorUpdates.getName());
	    existingDoctor.setEmail(doctorUpdates.getEmail());
	    existingDoctor.setPassword(doctorUpdates.getPassword()); // Assign password directly
	    existingDoctor.setPhone_number(doctorUpdates.getPhone_number());
	    existingDoctor.setSpecialization(doctorUpdates.getSpecialization());
	    existingDoctor.setQualification(doctorUpdates.getQualification());
	    existingDoctor.setExperience(doctorUpdates.getExperience());
	    existingDoctor.setWorkingHours(doctorUpdates.getWorkingHours());
	    existingDoctor.setImage(doctorUpdates.getImage());
	    existingDoctor.setAvailable(doctorUpdates.isAvailable()); // Example of a boolean field

	    // Save and return the updated doctor
	    return doctorRepo.save(existingDoctor);
	}

	 

	    public void toggleAvailability(Long id) {
	        Doctor doctor = doctorRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));
	        doctor.setAvailable(!doctor.isAvailable());
	        doctorRepo.save(doctor);
	    }
	    
	    public Doctor getDoctorById(Long id) {
	        return doctorRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Doctor not found"));
	    }

	    public List<Doctor> getAllDoctors() {
	        return doctorRepo.findAll();
	    }
	    
	    
	
	
}

