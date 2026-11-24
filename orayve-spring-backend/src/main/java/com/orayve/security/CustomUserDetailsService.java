package com.orayve.security;

import com.orayve.entity.User;
import com.orayve.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        User user = userRepository.findByMobileNumber(mobile)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with mobile: " + mobile));

        return new org.springframework.security.core.userdetails.User(
                user.getMobileNumber(),
                "",
                !user.getIsBanned(),
                true,
                true,
                !user.getIsBanned(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
