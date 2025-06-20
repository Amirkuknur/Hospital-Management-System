package com.excelr.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.excelr.Exceptions.ResourceNotFoundException;
import com.excelr.model.*;
import com.excelr.repo.*;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;

@Service
@Transactional
public class AppointmentService {
    @Autowired
    private AppointmentsRepository apRepository;
    @Autowired
    private DoctorRepo doctorRepo;
    @Autowired
    private UserRepo userRepo;

    public Appointments scheduleAppointment(String userName, String doctorName, 
            LocalDateTime appointmentTime, String prescription, 
            String doctorNotes, String virtualLink) {

        User user = userRepo.findByName(userName)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with name: " + userName));

        Doctor doctor = doctorRepo.findByName(doctorName)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with name: " + doctorName));

        if (!isAvailableByDoctorName(doctorName, appointmentTime)) {
            throw new ValidationException("Doctor is not available at the requested time");
        }

        Appointments appointments = new Appointments();
        appointments.setDoctor(doctor);
        appointments.setPatient(user);
        appointments.setAppointmentDate(appointmentTime.toLocalDate());
        appointments.setAppointmentTime(appointmentTime.toLocalTime());
        appointments.setDoctorNotes(doctorNotes != null ? doctorNotes : "No notes provided");
        appointments.setStatus("SCHEDULED");
        appointments.setVirtualLink(virtualLink != null ? virtualLink : "No virtual link available");
        appointments.setPrescription(prescription != null ? prescription : "No prescription");

        return apRepository.save(appointments);
    }
    public boolean isAvailable(Long doctorId, LocalDateTime requestedTime) {
        LocalDate requestedDate = requestedTime.toLocalDate();
        LocalTime requestedTimeOfDay = requestedTime.toLocalTime();

        List<Appointments> existingAppointments = apRepository.findByDoctorId(doctorId);

        return existingAppointments.stream()
            .noneMatch(appointment ->
                appointment.getAppointmentDate().isEqual(requestedDate) &&
                appointment.getAppointmentTime().equals(requestedTimeOfDay));
    }
    public boolean isAvailableByDoctorName(String doctorName, LocalDateTime requestedTime) {
        Doctor doctor = doctorRepo.findByName(doctorName)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with name: " + doctorName));

        LocalDate requestedDate = requestedTime.toLocalDate();
        LocalTime requestedTimeOfDay = requestedTime.toLocalTime();

        List<Appointments> existingAppointments = apRepository.findByDoctorId(doctor.getId());

        return existingAppointments.stream()
            .noneMatch(appointment ->
                appointment.getAppointmentDate().isEqual(requestedDate) &&
                appointment.getAppointmentTime().equals(requestedTimeOfDay));
    }
    
    public List<Appointments> getall() {
    	return apRepository.findAll();
    }
    
    public Optional<Appointments>getById(Long id){
    	return apRepository.findById(id);
    }
}