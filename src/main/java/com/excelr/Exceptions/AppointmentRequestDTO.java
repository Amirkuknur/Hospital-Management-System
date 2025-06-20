package com.excelr.Exceptions;

import java.time.LocalDateTime;

public class AppointmentRequestDTO {

	private Long userid;
    private String doctorName;
    private LocalDateTime appointmentTime;
    private String prescription;
    private String doctorNotes;
    private String virtualLink;
	public Long getUserid() {
		return userid;
	}
	public void setUserid(Long userid) {
		this.userid = userid;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public LocalDateTime getAppointmentTime() {
		return appointmentTime;
	}
	public void setAppointmentTime(LocalDateTime appointmentTime) {
		this.appointmentTime = appointmentTime;
	}
	public String getPrescription() {
		return prescription;
	}
	public void setPrescription(String prescription) {
		this.prescription = prescription;
	}
	public String getDoctorNotes() {
		return doctorNotes;
	}
	public void setDoctorNotes(String doctorNotes) {
		this.doctorNotes = doctorNotes;
	}
	public String getVirtualLink() {
		return virtualLink;
	}
	public void setVirtualLink(String virtualLink) {
		this.virtualLink = virtualLink;
	}

    
}

