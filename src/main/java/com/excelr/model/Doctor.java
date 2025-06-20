package com.excelr.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data

public class Doctor {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone_number;
    private String specialization;
    private String qualification;
    private String experience;
    private String image;
    private boolean isAvailable = true;
    private String workingHours;
    @Enumerated(EnumType.STRING)
    private Role role;

}
