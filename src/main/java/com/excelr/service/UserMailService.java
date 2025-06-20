package com.excelr.service;

import java.util.Random;

import org.springframework.stereotype.Service;

import com.excelr.model.User;
import com.excelr.repo.UserRepo;

@Service
public class UserMailService {

    private final MailService mailService;
    private final UserRepo userRepo;

    public UserMailService(MailService mailService, UserRepo userRepo) {
        this.mailService = mailService;
        this.userRepo = userRepo;
    }

    public String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    public void sendOTP(User user) {
        String otp = generateOTP();
        user.setOtp(otp);
        userRepo.save(user);
        mailService.sendOTP(user.getEmail(), otp);
    }

    public boolean verifyEmail(String email, String otp) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found..."));
        if (otp.equals(user.getOtp())) {
            user.setVerified(true);
           // user.setOtp(null); // Clear OTP after verification
            userRepo.save(user);
            return true;
        }
        return false;
    }

    public boolean checkEmailExist(String email) {
        return userRepo.findByEmail(email).isPresent();
    }
}
