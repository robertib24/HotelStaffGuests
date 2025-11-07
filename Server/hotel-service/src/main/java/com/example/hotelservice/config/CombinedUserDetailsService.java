package com.example.hotelservice.config;

import com.example.hotelservice.repository.EmployeeRepository;
import com.example.hotelservice.repository.GuestRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CombinedUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;
    private final GuestRepository guestRepository;

    public CombinedUserDetailsService(EmployeeRepository employeeRepository, GuestRepository guestRepository) {
        this.employeeRepository = employeeRepository;
        this.guestRepository = guestRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return employeeRepository.findByEmail(email)
                .map(UserDetails.class::cast)
                .orElseGet(() -> guestRepository.findByEmail(email)
                        .map(UserDetails.class::cast)
                        .orElseThrow(() -> new UsernameNotFoundException("Utilizatorul nu a fost găsit cu email-ul: " + email)));
    }
}