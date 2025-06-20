package com.excelr.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.excelr.Exceptions.AppointmentRequestDTO;
import com.excelr.Exceptions.ResourceNotFoundException;
import com.excelr.model.Appointments;
import com.excelr.model.Doctor;
import com.excelr.model.Staff;
import com.excelr.model.User;
import com.excelr.repo.AppointmentsRepository;
import com.excelr.repo.DoctorRepo;
import com.excelr.repo.StaffRepository;
import com.excelr.repo.UserRepo;
import com.excelr.security.JwtUtil;
import com.excelr.service.AppointmentService;
import com.excelr.service.DoctorSearch;
import com.excelr.service.DoctorService;
import com.excelr.service.HmsService;
import com.excelr.service.UserMailService;

import jakarta.validation.Valid;
import jakarta.validation.ValidationException;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HmsController {
	
	@Autowired
	public HmsService hmsService;
	
	@Autowired
	public StaffRepository staffRepository;
	
	@Autowired
	public DoctorRepo doctorRepo;
	
	@Autowired
	private UserMailService userMailService;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private DoctorService doctorService;
	
	@Autowired
	private AppointmentService appointmentService;
	
	@Autowired
	private AppointmentsRepository apRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private DoctorSearch doctorSearch;
	
	public HmsController(DoctorSearch doctorSearch) {
		super();
		this.doctorSearch = doctorSearch;
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody User user) {
	    try {
	        String email = user.getEmail();
	        if (userMailService.checkEmailExist(email)) 
	            return ResponseEntity.status(401).body("Email already exists");

	        userRepo.save(user);
	        userMailService.sendOTP(user);
	        
	        return ResponseEntity.ok("OTP sent to " + user.getEmail());
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
	    }
	}

	
	@PostMapping("/verify")
	public ResponseEntity<String> verify(@RequestParam String email, @RequestParam String otp){
		try {
			boolean isVerified=userMailService.verifyEmail(email, otp);
			if(isVerified) {
				return ResponseEntity.ok("OTP verified successfully! User registration success .");
				
			}else {
				return ResponseEntity.status(500).body("Invalid OTP. Please try again.");
			}
			
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Verification Failed "+e.getMessage());
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
	    String emailOrUsername = loginData.get("email"); 
	    String password = loginData.get("password");
	    
	    Map<String, String> response = new HashMap<>();

	    // Check User Repository
	    Optional<User> user = userRepo.findByEmail(emailOrUsername);
	    if (user.isPresent() && password.equals(user.get().getPassword())) { // Direct password comparison
	        String token = jwtUtil.generateToken(emailOrUsername, "USER"); // Generate JWT for User
	        response.put("login", "success");
	        response.put("role", "USER");
	        response.put("token", token);
	        return ResponseEntity.ok(response);
	    }

	    // Check Doctor Repository
	    Optional<Doctor> doctor = doctorRepo.findByEmail(emailOrUsername);
	    if (doctor.isPresent() && password.equals(doctor.get().getPassword())) { // Direct password comparison
	        String token = jwtUtil.generateToken(emailOrUsername, "DOCTOR"); // Generate JWT for Doctor
	        response.put("login", "success");
	        response.put("role", "DOCTOR");
	        response.put("token", token);
	        return ResponseEntity.ok(response);
	    }

	    // Check Staff Repository
	    Optional<Staff> staff = staffRepository.findByEmail(emailOrUsername);
	    if (staff.isPresent() && password.equals(staff.get().getPassword())) { // Direct password comparison
	        String token = jwtUtil.generateToken(emailOrUsername, "STAFF"); // Generate JWT for Staff
	        response.put("login", "success");
	        response.put("role", "STAFF");
	        response.put("token", token);
	        return ResponseEntity.ok(response);
	    }

	    // If none match, return failed login response
	    response.put("login", "fail");
	    response.put("message", "Invalid credentials. Please try again.");
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	

	@PostMapping("/forgetpassword")
	public ResponseEntity<String> forgotPassword(@RequestParam String email) {
	    Optional<User> userOptional = userRepo.findByEmail(email);
	    if (userOptional.isEmpty()) {
	        return ResponseEntity.status(404).body("User not found");
	    }
	    userMailService.sendOTP(userOptional.get());
	    return ResponseEntity.ok("OTP sent to your email for password reset.");
	}

	@PostMapping("/verify-reset-otp")
	public ResponseEntity<String> verifyResetOtp(@RequestParam String email, @RequestParam String otp) {
	    boolean isVerified = userMailService.verifyEmail(email, otp);
	    if (isVerified) {
	        return ResponseEntity.ok("OTP verified. You may now reset your password.");
	    } else {
	        return ResponseEntity.status(400).body("Invalid OTP");
	    }
	}

	@PostMapping("/resetpassword")
	public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
	    Optional<User> userOptional = userRepo.findByEmail(email);
	    if (userOptional.isEmpty()) {
	        return ResponseEntity.status(404).body("User not found");
	    }
	    User user = userOptional.get();
	    user.setPassword(newPassword);
	    userRepo.save(user);
	    return ResponseEntity.ok("Password reset successfully");
	}

	 
	    

	  @PostMapping("/user/schedule")
	  public ResponseEntity<?> scheduleAppointment(
	            @RequestParam String userName,
	            @RequestParam String doctorName,
	            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime appointmentTime,
	            @RequestParam(required = false) String prescription,
	            @RequestParam(required = false) String doctorNotes,
	            @RequestParam(required = false) String virtualLink) {
	        
	        try {
	            Appointments scheduledAppointment = appointmentService.scheduleAppointment(
	                userName,
	                doctorName,
	                appointmentTime,
	                prescription,
	                doctorNotes,
	                virtualLink
	            );
	            return ResponseEntity.ok(scheduledAppointment);
	        } catch (ResourceNotFoundException e) {
	            return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body(e.getMessage());
	        } catch (ValidationException e) {
	            return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body(e.getMessage());
	        } catch (Exception e) {
	            return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("An error occurred while scheduling the appointment: " + e.getMessage());
	        }
	    }

	    @GetMapping("/user/check-availability")
	    public ResponseEntity<?> checkDoctorAvailability1(
	            @RequestParam Long doctorId,
	            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime appointmentTime) {
	        
	        try {
	            boolean isAvailable = appointmentService.isAvailable(doctorId, appointmentTime);
	            return ResponseEntity.ok(isAvailable);
	        } catch (Exception e) {
	            return ResponseEntity
	                .status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Error checking availability: " + e.getMessage());
	        }
	    }
	    
	    @GetMapping("/allAppointments")
		public List<Appointments>findAll(){
			return appointmentService.getall();
		}
		  @DeleteMapping("/appointment/{id}")
		  public String deleteByid(@PathVariable Long id){
			  if(!apRepository.existsById(id)) {
				  throw new UnknownError("Appoitment Not Found");
			  }
			  apRepository.deleteById(id);
			  return "Appointment Cancle ";
		  }
		  
		  @PutMapping("/appointments/reschedule/{id}")
		  public ResponseEntity<String> rescheduleAppointment(@PathVariable Long id, @RequestBody Map<String, String> request) {
		      Optional<Appointments> optionalAppointment = apRepository.findById(id);

		      if (optionalAppointment.isPresent()) {
		          Appointments appointment = optionalAppointment.get();

		          // Extract new date and time from request body
		          String newDateStr = request.get("appointmentDate");
		          String newTimeStr = request.get("appointmentTime");

		          if (newDateStr == null || newTimeStr == null) {
		              return ResponseEntity.badRequest().body("Appointment date and time are required");
		          }

		          try {
		              // Convert Strings to LocalDate and LocalTime
		              LocalDate newDate = LocalDate.parse(newDateStr);
		              LocalTime newTime = LocalTime.parse(newTimeStr);

		              // Set new values
		              appointment.setAppointmentDate(newDate);
		              appointment.setAppointmentTime(newTime);
		              appointment.setStatus("RESCHEDULED");

		              apRepository.save(appointment);

		              return ResponseEntity.ok("Appointment rescheduled successfully");
		          } catch (DateTimeParseException e) {
		              return ResponseEntity.badRequest().body("Invalid date or time format. Use YYYY-MM-DD for date and HH:mm:ss for time.");
		          }
		      }

		      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
		  }
		  @GetMapping("/seach")
		    public List<Doctor> seraching(@RequestParam String keywords){
		    	return doctorSearch.searchDoctor(keywords);
		    }
		
	
	 //STAFF REGISTRATION
	    @PostMapping("/staff/register")
	    public ResponseEntity<Staff> register(@RequestBody Staff staff) {
	    	Staff res= hmsService.saveUser(staff);
	    	return ResponseEntity.ok(res);
	    }

	  
	    //DOCTOR REGISTRATION
	@PostMapping("/doctor/register")
	public ResponseEntity<Doctor> register(@RequestBody Doctor doctor) {
		Doctor res=doctorService.registerDoctor(doctor);
		return ResponseEntity.ok(res);
	}
		
	@DeleteMapping("doctor/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        doctorRepo.deleteById(id);
        return "Doctor Deleted Successfull";
    }

    @PatchMapping("doctor/{id}/availability")
    public ResponseEntity<Void> toggleAvailability(@PathVariable Long id) {
        doctorService.toggleAvailability(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("doctor/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody Doctor doctor) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @GetMapping("doctor/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }
    //should be available for patient and admin
    @GetMapping("/Alldoctor")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/all")
    public List<Doctor>  getAll() {
    	return doctorService.getAllDoctors();
    }
    @GetMapping("/doctor/appointments/{id}")
    public ResponseEntity<List<Appointments>> doctorAppointments(@PathVariable Long id){
    	List<Appointments> appointment=hmsService.getDoctorAppointment(id);
    	return ResponseEntity.ok(appointment);
    }
     //DOCTOR DASBOARD
    
    @GetMapping("/doctor/patients/{doctorId}")
    public ResponseEntity<List<User>> getDoctorPatients(@PathVariable Long doctorId) {
        List<User> patients = hmsService.getDoctorPatients(doctorId);
        return ResponseEntity.ok(patients);
    }
      
	// admin dashboard functions...
	//patient handle
	
	@GetMapping("/staff/admin/appointments")
	public ResponseEntity<List<Appointments>> manageAppointments() {
		List<Appointments> appointment= hmsService.getAllAppointments();
		return ResponseEntity.ok(appointment);
		
	}
	 @DeleteMapping("/staff/admin/appointment/{id}")
	  public String adminDeletById(@PathVariable Long id){
		  apRepository.deleteById(id);
		  return "Appointment Deleted ";
	  }
	@PostMapping("/staff/admin/newuser")
	 public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = hmsService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }
	@PutMapping("/staff/admin/user/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = hmsService.updatedUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }
	
	@DeleteMapping("/staff/admin/deleteuser/{id}")
	public String deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return "User deleted successfully!";
    }
	@GetMapping("/staff/users")
	public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = hmsService.getAllUsers();
        return ResponseEntity.ok(users);
    }
	
	@GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestParam String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/profile/update")
    public ResponseEntity<User> updateUserProfile(@RequestParam String email, @RequestBody User updatedUser) {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setPhone_number(updatedUser.getPhone_number());
            existingUser.setAge(updatedUser.getAge());
            existingUser.setImage(updatedUser.getImage());
            return ResponseEntity.ok(userRepo.save(existingUser));
        }
        return ResponseEntity.notFound().build();
    }
	
	
	
	
}
