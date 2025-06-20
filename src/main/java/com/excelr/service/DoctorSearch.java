package com.excelr.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.excelr.model.Doctor;
import com.excelr.repo.DoctorRepo;

@Service
public class DoctorSearch {

	@Autowired
	private DoctorRepo doRepo;

	public DoctorSearch(DoctorRepo doRepo) {
		
		this.doRepo = doRepo;
	}
	
	 public List<Doctor> searchDoctor(String keywords) {
	        return doRepo.searchDoctors(keywords);
	    }
	
}

