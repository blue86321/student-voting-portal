package edu.scu.studentvotingportal.controller;

import edu.scu.studentvotingportal.dto.UniversityParams;
import edu.scu.studentvotingportal.entity.University;
import edu.scu.studentvotingportal.entity.Users;
import edu.scu.studentvotingportal.exception.DataExistsException;
import edu.scu.studentvotingportal.exception.DataNotExistsException;
import edu.scu.studentvotingportal.repository.UniversityRepository;
import edu.scu.studentvotingportal.repository.UserRepository;
import edu.scu.studentvotingportal.utils.Permissions;
import edu.scu.studentvotingportal.utils.Resp;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/university/")
public class UniversityController {

    @Autowired
    UniversityRepository universityRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> createUniversity(Authentication authentication, @RequestBody UniversityParams params) {
        checkSuperUser(authentication);

        String universityName = params.getName();
        universityRepository
            .findFirstByName(universityName)
            .ifPresent(university -> {
                throw new DataExistsException("University already exists");
            });

        University university = new University();
        university.setName(universityName);
        University savedUniversity = universityRepository.save(university);
        return new ResponseEntity<>(Resp.Success(HttpStatus.CREATED.value(), savedUniversity), HttpStatus.CREATED);
    }

    @DeleteMapping("{universityId}/")
    @Operation(security = { @SecurityRequirement(name = "token") })
    public ResponseEntity<Resp> deleteUniversity(Authentication authentication, @PathVariable String universityId) {
        checkSuperUser(authentication);

        University university = universityRepository
            .findById(Long.valueOf(universityId))
            .orElseThrow(() -> new DataNotExistsException("University not found"));
        universityRepository.delete(university);
        return new ResponseEntity<>(Resp.Success(HttpStatus.NO_CONTENT.value()), HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<Resp> getUniversityList() {
        List<University> universityList = universityRepository.findAll();
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), universityList));
    }

    @GetMapping("{universityId}/")
    public ResponseEntity<Resp> getUniversity(@PathVariable String universityId) {
        University university = universityRepository
            .findById(Long.valueOf(universityId))
            .orElseThrow(() -> new DataNotExistsException("University not found"));
        return ResponseEntity.ok(Resp.Success(HttpStatus.OK.value(), university));
    }

    private void checkSuperUser(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        Users user = userRepository
            .findById(userId)
            .orElseThrow(() -> new DataNotExistsException("User not found"));
        Permissions.superuser(user);
    }
}
