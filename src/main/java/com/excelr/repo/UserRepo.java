package com.excelr.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.excelr.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);
	 Optional<User> findByName(String userName);

	 

}
