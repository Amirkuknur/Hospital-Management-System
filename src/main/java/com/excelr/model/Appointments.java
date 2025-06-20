package com.excelr.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="appointments")
@Data
public class Appointments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", insertable = false, updatable = false)
    private Long patientId;

    @Column(name = "doctor_id", insertable = false, updatable = false)
    private Long doctorId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String prescription;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String virtualLink;
    private String doctorNotes;

    // Custom getters to ensure we always have access to IDs
    public Long getPatientId() {
        if (patientId != null) return patientId;
        return patient != null ? patient.getId() : null;
    }

    public Long getDoctorId() {
        if (doctorId != null) return doctorId;
        return doctor != null ? doctor.getId() : null;
    }
    
    public User getUser() {
        return patient;
    }
}