//package com.excelr.service;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import com.excelr.model.Appointments;
//import com.excelr.model.Staff;
//import com.excelr.model.User;
//import com.excelr.repo.AppointmentsRepository;
//import com.excelr.repo.StaffRepository;
//import com.excelr.repo.UserRepo;
//
//@Service
//public class HmsService {
//	
//	@Autowired
//	public StaffRepository staffRepository;
//	
//	@Autowired
//	public UserRepo userRepo;
//	
//	@Autowired
//	public AppointmentsRepository appointmentsRepository;
//	
//	//
//	public Staff saveUser(Staff staff) {
//		return staffRepository.save(staff);
//	}
//	
//	public List<Appointments> getAllAppointments(){
//		return appointmentsRepository.findAll();
//	}
//	//managing user accounts by admin
//	//create user
//	public User createUser(@RequestBody User user) {
//		return userRepo.save(user);
//	}
//	//read users
//	public List<User> getAllUsers() {
//        return userRepo.findAll();
//    }
//	
//	public Optional<User> getUserById(@RequestParam Long id){
//		return userRepo.findById(id);
//	}
//	//update user
//	public User updatedUser(Long id,User updatedUser) {
//		Optional<User> optionalUser=userRepo.findById(id);
//		if(optionalUser.isPresent()) {
//			User existingUser = optionalUser.get();
//			existingUser.setName(updatedUser.getName());
//			existingUser.setPassword(updatedUser.getPassword());
//			existingUser.setEmail(updatedUser.getEmail());
//			existingUser.setPhone_number(updatedUser.getPhone_number());
//	            return userRepo.save(existingUser);
//		}
//		throw new RuntimeException("User not found with ID: " + id);
//	}
//	//delete user
//	public void deleteUser(Long id) {
//        userRepo.deleteById(id);
//    }
//	
//	// new doctor
//	public Staff createDoctor(@RequestBody Staff staff) {
//		return staffRepository.save(staff);
//	}
//
//	
//	
//}


package com.excelr.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.excelr.model.Appointments;
import com.excelr.model.Staff;
import com.excelr.model.User;
import com.excelr.repo.AppointmentsRepository;
import com.excelr.repo.StaffRepository;
import com.excelr.repo.UserRepo;

@Service
public class HmsService {
	
	@Autowired
	public StaffRepository staffRepository;
	
	@Autowired
	public UserRepo userRepo;
	
	@Autowired
	public AppointmentsRepository appointmentsRepository;
	
	public Staff saveUser(Staff staff) {
		return staffRepository.save(staff);
	}
	
	public List<Appointments> getAllAppointments(){
		return appointmentsRepository.findAll();
	}
	
	public List<Appointments> getDoctorAppointment(Long id) {
		return appointmentsRepository.findByDoctorId(id);
		
	}
	
	//managing user accounts by admin
	//create user
	public User createUser(@RequestBody User user) {
		return userRepo.save(user);
	}
	//read users
	public List<User> getAllUsers() {
        return userRepo.findAll();
    }
	//update user
	public User updatedUser(Long id,User updatedUser) {
		Optional<User> optionalUser=userRepo.findById(id);
		if(optionalUser.isPresent()) {
			User existingUser = optionalUser.get();
			existingUser.setName(updatedUser.getName());
			existingUser.setPassword(updatedUser.getPassword());
			existingUser.setEmail(updatedUser.getEmail());
			existingUser.setPhone_number(updatedUser.getPhone_number());
	            return userRepo.save(existingUser);
		}
		throw new RuntimeException("User not found with ID: " + id);
	}
	
	
	public void delelteApp(Long id) {
		appointmentsRepository.deleteById(id);
	}
	
	  public List<User> getDoctorPatients(Long doctorId) {
	        List<Appointments> appointments = appointmentsRepository.findByDoctorId(doctorId);
	        
	        return appointments.stream()
	                .map(Appointments::getUser)  // Extract patient from each appointment
	                .distinct()  // Remove duplicates in case of multiple visits
	                .collect(Collectors.toList());
	    }

	
	
	
}

