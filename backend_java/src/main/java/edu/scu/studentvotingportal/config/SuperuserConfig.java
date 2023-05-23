package edu.scu.studentvotingportal.config;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;

@Component
public class SuperuserConfig implements CommandLineRunner {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UniversityRepository universityRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static final String DEFAULT_UNIVERSITY = "Santa Clara University";
    private static final String DEFAULT_SUPSERUSER_EMAIL = "super@gmail.com";
    private static final String DEFAULT_SUPSERUSER_PASSWORD = "super";

    @Override
    public void run(String... args) throws Exception {
        // create university
        University defaultUniversity = universityRepository.findFirstByName(DEFAULT_UNIVERSITY).orElse(null);
        if (defaultUniversity == null) {
            defaultUniversity = universityRepository.save(University.builder().name(DEFAULT_UNIVERSITY).build());
        }

        // create superuser
        if (userRepository.findFirstByEmail(DEFAULT_SUPSERUSER_EMAIL).isPresent()) {
            return;
        }
        Users superuser = Users.builder()
                .email(DEFAULT_SUPSERUSER_EMAIL)
                .password(passwordEncoder.encode(DEFAULT_SUPSERUSER_PASSWORD))
                .dob(new SimpleDateFormat("yyyy-MM-dd").parse("1900-01-01"))
                .university(defaultUniversity)
                .staff(true)
                .superuser(true)
                .build();
        userRepository.save(superuser);
    }
}